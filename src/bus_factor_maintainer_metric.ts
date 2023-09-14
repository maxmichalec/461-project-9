#!/usr/bin/env node
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
		console.log(`npmjs package: ${sections[2]}`);
		// Find the GitHub URL for the package
		repoURL = await findGitHubRepoUrl(sections[2]);
		if (repoURL === null) {
			console.log(`This npmjs package is not stored in a GitHub repository.`);
			return [bus_factor, responsive_maintainer];
		}
	}

	console.log(`GitHub repository: ${repoURL}`);

	// Add check for GitHub URL here (if it is GitHub)

	// Make GraphQL query to GitHub API to get date of most recent pull request
	const query = `
		{
			repository(owner: "maxmichalec", name: "461-project-9") {
				issues(last: 1, states: OPEN) {
					edges {
						node {
							title
						}
					}
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

		gqlRequest.repository.issues.edges.forEach((issue: any) => {
			console.log(issue.node.title);
		});
	} catch (error) {
		console.error(`Error fetching GitHub repository: ${error}`);
		return [0, 0];
	}

	return [bus_factor, responsive_maintainer];
}
