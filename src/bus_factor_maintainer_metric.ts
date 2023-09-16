#!/usr/bin/env node
import logger from './run'
import git from 'isomorphic-git';
import { graphql, GraphQlQueryResponseData } from '@octokit/graphql';
import { findGitHubRepoUrl } from './license_ramp_up_metric';
import fetch from 'node-fetch';

export async function bus_factor_maintainer_metric(repoURL: string) : Promise<number[]> {
	// Metrics to be calculated
	let bus_factor: number = 0;
	let responsive_maintainer: number = 0;

	// Check whether the URL is GitHub or NPMJS URL
	const url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
	const sections = url.split('/');
	if (sections[0] === 'npmjs.com') {
		logger.log({'level': 'info', 'message': `npmjs package: ${sections[2]}`});
		// Find the GitHub URL for the package
		repoURL = await findGitHubRepoUrl(sections[2]);
		if (repoURL === 'none') {
			logger.log({'level': 'error', 'message': `This npmjs package is not stored in a GitHub repository.`});
			return [bus_factor, responsive_maintainer];
		}
	}

	logger.log({'level': 'info', 'message': `GitHub repository: ${repoURL}`});

	// Add check for GitHub URL here (if it is GitHub)

	// Make GraphQL query to GitHub API to get date of most recent 3 pull requests and number of collaborators
	const query = `
		{
			repository(owner: "${sections[1]}", name: "${sections[2]}") {
				pullRequests(last: 3, orderBy: {field: CREATED_AT, direction: DESC}) {
					nodes {
						createdAt
					}
				}
				collaborators {
					totalCount
				}
			}
		}
	`;

	try {
		const gqlRequest: GraphQlQueryResponseData = await graphql(query, {
			headers: {
				authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
			request: {
				fetch: fetch,
			},
		});

		// Iterate through (up to 3) PRs to calculate part of responsive maintainer metric
		gqlRequest.repository.pullRequests.nodes.forEach((pullRequest: any) => {
			responsive_maintainer += 0.16;
			logger.log({'level': 'info', 'message': `Pull request created at: ${pullRequest.createdAt}`});
		});

		// Factor in number of collaborators to calculate part of responsive maintainer metric
		responsive_maintainer += Math.min(0.5, gqlRequest.repository.collaborators.totalCount / 15);
	} catch (error) {
		logger.log({'level': 'error', 'message': `Error fetching GitHub repository: ${error}`});
		return [0, 0];
	}

	return [bus_factor, responsive_maintainer];
}
