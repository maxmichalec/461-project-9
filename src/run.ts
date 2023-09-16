#!/usr/bin/env node
import * as fs from 'fs';
import { license_ramp_up_metric } from './license_ramp_up_metric';
import { bus_factor_maintainer_metric } from './bus_factor_maintainer_metric';
import * as dotenv from 'dotenv';
import * as winston from 'winston';

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
    let l_r_metric_array: number[]; //[0] = License Score, [1] = Ramp Up Score, [2] = Correctness Score
    let bf_rm_metric_array: number[];
    var number = 0;
    var net_score = 0;
    for(const url of urls) {
      logger.log({'level': 'info', 'message': `The URL that is currently running is ${url}`});
      l_r_metric_array = await license_ramp_up_metric(url); //returns license metric first and then ramp up metric
      logger.log({'level': 'info', 'message': `The license metric is ${l_r_metric_array[0]}`});
      logger.log({'level': 'info', 'message': `The ramp up metric is ${l_r_metric_array[1]}`});
      logger.log({'level': 'info', 'message': `The correctness metric is ${l_r_metric_array[2]}`});
      bf_rm_metric_array = await bus_factor_maintainer_metric(url);
      logger.log({'level': 'info', 'message': `The bus factor metric is ${bf_rm_metric_array[0]}`});
      logger.log({'level': 'info', 'message': `The responsive maintainer metric is ${bf_rm_metric_array[1]}`});

      // Calculate net score
      net_score = l_r_metric_array[0] + l_r_metric_array[1] + l_r_metric_array[2] + bf_rm_metric_array[0] + bf_rm_metric_array[1];

      console.log(`{"URL":"${url}", "NET_SCORE":${net_score}, "RAMP_UP_SCORE":${l_r_metric_array[1]}, "CORRECTNESS_SCORE":${l_r_metric_array[2]}, "BUS_FACTOR_SCORE":${bf_rm_metric_array[0]}, "RESPONSIVE_MAINTAINER_SCORE":${bf_rm_metric_array[1]}, "LICENSE_SCORE":${l_r_metric_array[0]}}`);
    }
  } catch (err) {
    logger.log({'level': 'error', 'message': `${err}`});
  }

  //console.log('Processing URLs...');
  process.exit(0);
}

// Function to run the test suite
function runTests() {
  // Add code to run your test suite here
  // You can use testing frameworks like Jest, Mocha, etc.

  // Replace the above comment with your actual test suite command.

  logger.log({'level': 'info', 'message': `Running tests...`});
  process.exit(0);
}

// Main CLI
const args = process.argv.slice(2);

// Load environment variables from .env file
dotenv.config();

// Clear LOG_FILE
// fs.writeFileSync(process.env.LOG_FILE, '');

// Configure logging to LOG_FILE
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE, level: 'info' }),
  ],
});

export default logger;

if(args[0] == 'test')
{
    runTests();
}
else 
{
    fs.access(args[0], fs.constants.F_OK, (err) => {
        if (err) {
            logger.log({'level': 'error', 'message': `File '${args[0]}' does not exist.`});
        } else {
            logger.log({'level': 'info', 'message': `File '${args[0]}' exists.`});
            processUrls(args[0]);
        }
    });
}