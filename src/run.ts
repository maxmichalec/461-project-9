#!/usr/bin/env node
import * as fs from 'fs';
import { license_ramp_up_metric } from './license_ramp_up_metric';

// Function to process URL_FILE and produce NDJSON output
async function processUrls(urlFile: string) {

  // Add code to process URLs and generate NDJSON output here
  // You can use libraries like axios or node-fetch to fetch data from URLs.

  // Replace the above comment with your actual code.
  try {
    const filePath = urlFile; // Replace with the path to your file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
  
    // Split the file contents into individual URLs based on new lines
    const urls = fileContents.split('\n').filter(url => url.trim() !== '');
  
    // Now you have an array of URLs, and you can work with them as needed
    //console.log(urls);
    let l_r_metric_array: number[];   
    var number = 0; 
    for(const url of urls) {
      console.log(`The URL that is currently running is ${url}`);
      l_r_metric_array = await license_ramp_up_metric(url, number); //returns license metric first and then ramp up metric
      number = number + 1; 
      console.log('License Metric:', l_r_metric_array[0]);
      console.log('Ramp Up Metric:', l_r_metric_array[1]);  
    }
  } catch (err) {
    console.error('Error:', err);
  }

  //console.log('Processing URLs...');
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