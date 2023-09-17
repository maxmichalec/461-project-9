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
			return [0, 0];
		}
	}

	// Check if the URL is a valid GitHub repository URL
	if (!repoURL.match(/^(https:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+$/i)) {
		logger.log({'level': 'error', 'message': `Invalid GitHub repository URL: ${repoURL}`});
		return [0, 0];
	}

	logger.log({'level': 'info', 'message': `GitHub repository: ${repoURL}`});

	// Make GitHub REST API call to get (up to 10) contributors to calculate impact for bus factor metric
	const topContributorsURL = `https://api.github.com/repos/${sections[1]}/${sections[2]}/contributors?per_page=10`;
	try {
		const response = await fetch(topContributorsURL, {
			headers: {
				authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
		});

		if (response.status !== 200) {
			logger.log({'level': 'error', 'message': `Failed to fetch GitHub contributors: Response ${response.status}`});
			return [0, 0];
		}

		const contributors = await response.json();
		// Iterate through (up to 10) contributors to calculate part of bus factor metric
		contributors.forEach((contributor: any) => {
			bus_factor += 0.1 * Math.min(contributor.contributions / 30, 1);
			logger.log({'level': 'info', 'message': `Contributor login: ${contributor.login}`});
		});
	} catch	(error) {
		logger.log({'level': 'error', 'message': `Error fetching GitHub contributors: ${error}`});
		return [0, 0];
	}

	// Make GitHub REST API call to get number of contributors to calculate part of responsive maintainer metric
	// Trick: List 1 contributor per page and use rel="last" in header to get total number of contributors
	const contributorsURL = `https://api.github.com/repos/${sections[1]}/${sections[2]}/contributors?per_page=1&anon=1`;
	try {
		const response = await fetch(contributorsURL, {
			headers: {
				authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
		});

		if (response.status !== 200) {
			logger.log({'level': 'error', 'message': `Failed to fetch GitHub contributors: Response ${response.status}`});
			return [0, 0];
		}

		// Get page number before rel="last" in header
		const header = response.headers.get('link');
		const lastPage = parseInt(header.match(/page=(\d+)>; rel="last"/)[1]);
		// Factor in number of collaborators to calculate part of responsive maintainer metric
		responsive_maintainer += Math.min(0.5, lastPage / 15);
	} catch	(error) {
		logger.log({'level': 'error', 'message': `Error fetching GitHub contributors: ${error}`});
		return [bus_factor, 0];
	}

	// Make GraphQL query to GitHub API to get date of (up to 5) most recent pull requests to calculate part of responsive maintainer metric
	const query = `
		{
			repository(owner: "${sections[1]}", name: "${sections[2]}") {
				pullRequests(last: 3, orderBy: {field: CREATED_AT, direction: DESC}) {
					nodes {
						createdAt
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

		// Iterate through (up to 5) PRs to calculate part of responsive maintainer metric
		// Calculate number of days since each PR was created (best if within past 2 weeks)
		gqlRequest.repository.pullRequests.nodes.forEach((pullRequest: any) => {
			const daysSince = Math.floor((new Date().getTime() - new Date(pullRequest.createdAt).getTime()) / (1000 * 3600 * 24));
			responsive_maintainer += 0.1 * Math.min(14 / Math.max(daysSince, 14), 1);
			logger.log({'level': 'info', 'message': `Pull request created at: ${pullRequest.createdAt}`});
		});
	} catch (error) {
		logger.log({'level': 'error', 'message': `Error fetching GitHub repository via GraphQL: ${error}`});
		return [bus_factor, 0];
	}

	return [bus_factor, responsive_maintainer];
}
