#!/usr/bin/env node
import logger from './run'
import git from 'isomorphic-git';
import { graphql, GraphQlQueryResponseData } from '@octokit/graphql';
import { findGitHubRepoUrl } from './license_ramp_up_metric';
import fetch from 'node-fetch';


// NEW CODE
// Function to fetch contributors from GitHub API
async function fetchContributors(url: string): Promise<any[] | null> {
  try {
    const response = await fetch(url, {
      headers: {
        //authorization: `token ${authToken}`,
		authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      logger.log({'level': 'error', 'message': `Failed to fetch GitHub contributors: Response ${response.status}`});
      return [response, null];
    }

    const contributors = await response.json();
	return [response, contributors]
  } catch (error) {
    logger.log({'level': 'error', 'message': `Error fetching GitHub contributors: ${error}`});
    return [null, null];
  }
}

// Function to fetch contributors from GitHub API
async function fetchResponse(url: string): Promise<any | null> {
	try {
	  const response = await fetch(url, {
		headers: {
		  //authorization: `token ${authToken}`,
		  authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	  });
  
	  if (response.status !== 200) {
		logger.log({'level': 'error', 'message': `Failed to fetch GitHub contributors: Response ${response.status}`});
		return null;
	  }
	  return response;

	} catch (error) {
	  logger.log({'level': 'error', 'message': `Error fetching GitHub contributors: ${error}`});
	  return null;
	}
  }

// Function to calculate bus factor based on contributors
function calculateBusFactor(contributors: any[]): number {
  let busFactor = 0;
  contributors.forEach((contributor) => {
    busFactor += 0.1 * Math.min(contributor.contributions / 30, 1);
	logger.log({'level': 'info', 'message': `Contributor login: ${contributor.login}`});
  });
  return busFactor;
}

// Function to calculate responsive maintainer based on contributors and last page
function calculateResponsiveMaintainer(contributors: any[], lastPage: number): number {
  const contributorsFactor = Math.min(0.5, lastPage / 15);
  // Add your calculation logic here based on contributors
  return contributorsFactor;
}

export async function bus_factor_maintainer_metric(repoURL: string): Promise<number[]> {
  // Metrics to be calculated
  let busFactor = 0;
  let responsiveMaintainer = 0;

  // Check whether the URL is GitHub or NPMJS URL
  const url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
  const sections = url.split('/');

  if (sections[0] === 'npmjs.com') {
    logger.log({'level': 'info', 'message': `npmjs package: ${sections[2]}`});
    // Find the GitHub URL for the package
    repoURL = await findGitHubRepoUrl(sections[2]); // You need to implement findGitHubRepoUrl
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

  // Make GitHub REST API call to get (up to 10) contributors to calculate bus factor
  const topContributorsURL = `https://api.github.com/repos/${sections[1]}/${sections[2]}/contributors?per_page=10`;

  const contributors = await fetchContributors(topContributorsURL);

  if (contributors === null) {
    return [0, 0];
  }

  busFactor = calculateBusFactor(contributors);

  // Make GitHub REST API call to get number of contributors to calculate responsive maintainer
  const contributorsPerPageURL = `https://api.github.com/repos/${sections[1]}/${sections[2]}/contributors?per_page=1&anon=1`;

  const contributorsPerPage = await fetchContributors(contributorsPerPageURL);

  if (contributorsPerPage === null) {
    return [0, 0];
  }

  //const header = response.headers.get('link');
  // TRY:
  const response = await fetchResponse(contributorsPerPageURL);
  if (response === null) {
	return [0, 0];
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

  responsiveMaintainer = calculateResponsiveMaintainer(contributorsPerPage, lastPage);

  return [busFactor, responsiveMaintainer];
}
