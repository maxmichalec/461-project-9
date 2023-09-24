#!/usr/bin/env node
import logger from './run'
import { graphql, GraphQlQueryResponseData } from '@octokit/graphql';
import { findGitHubRepoUrl } from './license_ramp_up_metric';
import fetch, { Response } from 'node-fetch';

export async function fetchResponse(queryUrl: string): Promise<Response> {
  try {
    const response = await fetch(queryUrl, {
      headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      logger.log({'level': 'error', 'message': `Failed to fetch GitHub REST API response: Response ${response.status}`});
      throw new Error(`Failed to fetch GitHub REST API response: Response ${response.status}`);
    }
    return response;
  } catch (error) {
    logger.log({'level': 'error', 'message': `Error fetching GitHub REST API response: ${error}`});
    throw error;
  }
}

export async function fetchGraphQL(query: string): Promise<GraphQlQueryResponseData> {
  try {
    const gqlRequest: GraphQlQueryResponseData = await graphql(query, {
			headers: {
				authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
			request: {
				fetch: fetch,
			},
		});

    return gqlRequest;
  } catch (error) {
    logger.log({'level': 'error', 'message': `Error fetching GitHub repository via GraphQL: ${error}`});
    throw error;
  }
}

export async function calcBusFactor(owner: string, repo: string): Promise<number> {
  // Make GitHub REST API call to get (up to 10) contributors to calculate impact for bus factor metric
  const queryUrl = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`;
  const response = await fetchResponse(queryUrl).catch((error) => {
    return null;
  });
  // return score of 0 if REST API call fails
  if (response === null) {
    return 0;
  }

  let contributors = await response.json();
  let busFactor = 0;
  contributors.forEach((contributor: any) => {
    busFactor += 0.1 * Math.min(contributor.contributions / 30, 1);
  });
  return busFactor;
}

export async function calcResponsiveMaintainer(owner: string, repo: string): Promise<number> {
  let responsive_maintainer = 0;
  // Make GitHub REST API call to get number of contributors to calculate part of responsive maintainer metric
	// Trick: List 1 contributor per page and use rel="last" in header to get total number of contributors
  const queryUrl = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=1`;
  const response = await fetchResponse(queryUrl).catch((error) => {
    return null;
  });
  // return score of 0 if REST API call fails
  if (response === null) {
    return 0;
  }

  const header = response.headers.get('link');
  var matchResult; 
  var lastPage; 
  if(header) {
    matchResult = header.match(/page=(\d+)>; rel="last"/);
    if(matchResult){
      lastPage = parseInt(matchResult[1]); 
    }
    else {
      lastPage = 0; 
    }
  }
  else {
    lastPage = 0; 
  }
  responsive_maintainer += Math.min(0.5, lastPage / 15);

  // Make GraphQL query to GitHub API to get date of (up to 5) most recent pull requests to calculate part of responsive maintainer metric
	const query = `
    {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequests(last: 3, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            createdAt
          }
        }
      }
    }
  `;

  const gqlResponse: GraphQlQueryResponseData | null = await fetchGraphQL(query).catch((error) => {
    return null;
  });
  // return score of 0 if GraphQL query fails
  if (gqlResponse === null) {
    return 0;
  }

  // Iterate through (up to 5) PRs to calculate part of responsive maintainer metric
  // Calculate number of days since each PR was created (best if within past 2 weeks)
  gqlResponse.repository.pullRequests.nodes.forEach((pullRequest: any) => {
    const daysSince = Math.floor((new Date().getTime() - new Date(pullRequest.createdAt).getTime()) / (1000 * 3600 * 24));
    responsive_maintainer += 0.1 * Math.min(14 / Math.max(daysSince, 14), 1);
    logger.log({'level': 'info', 'message': `Pull request created at: ${pullRequest.createdAt}`});
  });

  return responsive_maintainer;
}

export async function bus_factor_maintainer_metric(repoURL: string) : Promise<number[]> {
	// Metrics to be calculated
	let bus_factor: number = 0;
	let responsive_maintainer: number = 0;

	// Check whether the URL is GitHub or NPMJS URL
	let url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
	let sections = url.split('/');
	if (sections[0] === 'npmjs.com') {
		logger.log({'level': 'info', 'message': `npmjs package: ${sections[2]}`});
		// Find the GitHub URL for the package
		repoURL = await findGitHubRepoUrl(sections[2]);
		if (repoURL === 'none') {
			logger.log({'level': 'error', 'message': `This npmjs package is not stored in a GitHub repository.`});
			return [0, 0];
		}
    // Get owner and repo from GitHub URL
    url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
    sections = url.split('/');
    sections[2] = sections[2].replace(/\.git$/i, '');
	}

	// Check if the URL is a valid GitHub repository URL
	if (!repoURL.match(/^(https:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+$/i)) {
		logger.log({'level': 'error', 'message': `Invalid GitHub repository URL: ${repoURL}`});
		return [0, 0];
	}

	logger.log({'level': 'info', 'message': `GitHub URL: ${repoURL}`});
  logger.log({'level': 'info', 'message': `GitHub owner: ${sections[1]}, GitHub repo: ${sections[2]}`});

	// Calculate bus factor metric
  bus_factor = await calcBusFactor(sections[1], sections[2]);

  // Calculate responsive maintainer metric
  responsive_maintainer = await calcResponsiveMaintainer(sections[1], sections[2]);

	return [bus_factor, responsive_maintainer];
}