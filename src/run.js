#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var license_metric_1 = require("./license_metric");
// Function to install dependencies
function installDependencies() {
    // Add your dependency installation commands here
    // For example, to use npm for Node.js dependencies:
    var childProcess = require('child_process');
    childProcess.execSync('npm install --save fs-extra isomorphic-git', { stdio: 'inherit' });
    // You can add more commands as needed.
    // Replace the above comment with actual installation commands.
    console.log('Dependencies installed successfully.');
    process.exit(0);
}
// Function to process URL_FILE and produce NDJSON output
function processUrls(urlFile) {
    // Add code to process URLs and generate NDJSON output here
    // You can use libraries like axios or node-fetch to fetch data from URLs.
    // Replace the above comment with your actual code.
    try {
        var filePath = urlFile; // Replace with the path to your file
        var fileContents = fs.readFileSync(filePath, 'utf-8');
        // Split the file contents into individual URLs based on new lines
        var urls = fileContents.split('\n').filter(function (url) { return url.trim() !== ''; });
        // Now you have an array of URLs, and you can work with them as needed
        console.log(urls);
        var l_metric = (0, license_metric_1.license_metric)(urls[0]);
        console.log('License Metric:', l_metric);
    }
    catch (err) {
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
var args = process.argv.slice(2);
if (args[0] == 'install') {
    installDependencies();
}
else if (args[0] == 'test') {
    runTests();
}
else {
    fs.access(args[0], fs.constants.F_OK, function (err) {
        if (err) {
            console.error("File '".concat(args[0], " does not exist."));
        }
        else {
            console.log("File '".concat(args[0], " exists."));
            processUrls(args[0]);
        }
    });
}
