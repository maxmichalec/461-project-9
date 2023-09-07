#!/usr/bin/env node
import * as fs from 'fs';
import * as fse from 'fs-extra';
import git from 'isomorphic-git'; 
import http from 'isomorphic-git/http/node';

const compatibleLicenses = [
    'MIT License', 
    'BSD 2-Clause "Simplified" License', 
    'MIT license'
];

async function cloneRepository(repoUrl: string, localPath: string): Promise<void> {
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

export function license_metric(repoURL: string): number {
    const repoDir = '../../../../temp_repo'; //NEED TO FIGURE OUT WHERE TO PUT THE LOCAL REPO BC IT IS NOT CLONING IN ANOTHER GIT REPO
    console.log(repoDir);
    fse.ensureDir(repoDir); //will make sure the directory exists or will create a new one
    console.log(repoURL);
    cloneRepository(repoURL, repoDir); //this clones the repo into the directory

    //Reads in the cloned repository
    const readmePath = `${repoDir}/README.md`; 
    const readmeContent = fs.readFileSync(readmePath, 'utf-8'); 

    //looks for the licensing heading with a regex 
    const licenseHeading = readmeContent.match(/(License)\s*([-:]\s*)?([\w\s-]+)(\n|:|,|;|\(|\)|\r|$)/i);

    //Find where the License information is and compare it with the compatible licenses
    if(licenseHeading && licenseHeading[1]) {
        const licenseText = licenseHeading[1].trim(); 

        //check if there is an identified license that is compataible
        for(const compatibleLicense of compatibleLicenses) {
            if(licenseText.includes(compatibleLicense)) {
                return 1; //License found was compatible 
            }
        }
    }
    return 0; 
}