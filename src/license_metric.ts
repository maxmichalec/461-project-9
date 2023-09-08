#!/usr/bin/env node
import * as fs from 'fs';
import * as fse from 'fs-extra';
import git from 'isomorphic-git'; 
import http from 'isomorphic-git/http/node';
import axios from 'axios';

const compatibleLicenses = [
    'mit license', 
    'bsd 2-clause "simplified" license', 
    /(mit.*license|license.*mit)/i, 
    'mit'
];

async function cloneRepository(repoUrl: string, localPath: string): Promise<void> { //NEED TO GET THIS TO WORK FOR GIT REPO AND NPMJS MODULES
  try {
    // Clone the repository
    await git.clone({
      fs,
      http,
      dir: localPath,
      url: repoUrl,
    });

    console.log('Repository cloned successfully.');

    // Access Git metadata (e.g., list branches)
    const branches = await git.listBranches({
      fs,
      dir: localPath,
    });

    console.log('Branches:', branches);
  } catch (error) {
    console.error('Error cloning repository:', error);
  }
}


async function findGitHubRepoUrl(packageName: string): Promise<string> {
  try {
    // Fetch package metadata from the npm registry
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);

    if (response.status !== 200) {
      console.error(`Failed to fetch package metadata for ${packageName}`);
      return 'none';
    }

    // Parse the response JSON
    const packageMetadata = response.data;

    console.log(packageMetadata.repository);
    console.log(packageMetadata.repository.url);
    // Check if the "repository" field exists in the package.json
    if (packageMetadata.repository && packageMetadata.repository.url) {
      return packageMetadata.repository.url.match(/github\.com\/[^/]+\/[^/]+(?=\.git|$)/);
    } else {
      console.log(`No repository URL found for ${packageName}`);
      return 'none';
    }
  } catch (error) {
    console.error(`Error fetching package.json for ${packageName}: ${error.message}`);
    return 'none';
  }
} 

export async function license_metric(repoURL: string, num: number): Promise<number> {
    const repoDir = `C:/Users/Madi Arnold/Desktop/${num}`; //NEED TO FIGURE OUT WHERE TO PUT THE LOCAL REPO BC IT IS NOT CLONING IN ANOTHER GIT REPO
    //looks into tmpdir to make a temporay directory and then deleting at the end of the function 
    console.log(repoDir);
    fse.ensureDir(repoDir); //will make sure the directory exists or will create a new one
    
    //check the URL to see if it is a github url or a npmjs url 
    const url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
    const parts = url.split('/'); 
    if(parts[0] === 'npmjs.com') {
      console.log("This is a npmjs url");
      //finds the github url of the npmjs module
      console.log(`This is the npmjs package ${parts[2]}`);
      repoURL = await findGitHubRepoUrl(parts[2]);
      repoURL = 'https://' + repoURL; 
      if(repoURL == null) {
        console.log(`This npmjs is not stored in a github repository.`);
        return 0;
      }
    }
    console.log(repoURL);

    //probably need to add in something to check if the url is from github just to make sure 
    
    await cloneRepository(repoURL, repoDir); //clones the repository

    //Reads in the cloned repository
    var readmePath = `${repoDir}/Readme.md`; 
    var readmeContent = 'none';
    if(fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
    } else {
      readmePath = `${repoDir}/readme.markdown`; 
      if(fs.existsSync(readmePath)) {
        readmeContent = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
      } 
    }
    
    //NEED TO REMOVE THE CLONED DIRECTORY AFTER USING IT

    for(const compatibleLicense of compatibleLicenses) {
      if(readmeContent.match(compatibleLicense)) {
        return 1; //License found was compatible 
      }
    }
    return 0; 
}