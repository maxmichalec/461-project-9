#!/usr/bin/env node
import * as fs from 'fs';
import { license_metric } from './license_metric';

// Function to process URL_FILE and produce NDJSON output
function processUrls(urlFile: string) {

  // Add code to process URLs and generate NDJSON output here
  // You can use libraries like axios or node-fetch to fetch data from URLs.

  // Replace the above comment with your actual code.
  try {
    const filePath = urlFile; // Replace with the path to your file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
  
    // Split the file contents into individual URLs based on new lines
    const urls = fileContents.split('\n').filter(url => url.trim() !== '');
  
    // Now you have an array of URLs, and you can work with them as needed
    console.log(urls);
    var l_metric = license_metric(urls[0]); 
    console.log('License Metric:', l_metric); 

  } catch (err) {
    console.error('Error:', err);
  }

  console.log('Processing URLs...');
  process.exit(0);
}

// Function to run the test suite
function runTests() {
  // Add code to run your test suite here
  // You can use testing frameworks like Jest, Mocha, etc.

  // Replace the above comment with your actual test suite command.

  console.log('Running tests...');
  process.exit(0);
}

// Main CLI
const args = process.argv.slice(2);

if(args[0] == 'test')
{
    runTests();
}
else 
{
    fs.access(args[0], fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File '${args[0]} does not exist.`)
        } else {
            console.log(`File '${args[0]} exists.`)
            processUrls(args[0]);
        }
    });
}