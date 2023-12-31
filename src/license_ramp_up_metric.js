#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.license_ramp_up_metric = exports.calculate_correctness_metric = exports.findAllFiles = exports.calculate_ramp_up_metric = exports.countWords = exports.findGitHubRepoUrl = void 0;
var run_1 = require("./run");
var fs = require("fs");
var fse = require("fs-extra");
var isomorphic_git_1 = require("isomorphic-git");
var node_1 = require("isomorphic-git/http/node");
var axios_1 = require("axios");
var tmp = require("tmp");
var eslint_1 = require("eslint");
var path_1 = require("path");
var compatibleLicenses = [
    'mit license',
    'bsd 2-clause "simplified" license',
    /(mit.*license|license.*mit)/i,
];
function cloneRepository(repoUrl, localPath) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Clone the repository
                    return [4 /*yield*/, isomorphic_git_1.default.clone({
                            fs: fs,
                            http: node_1.default,
                            dir: localPath,
                            url: repoUrl,
                        })];
                case 1:
                    // Clone the repository
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    run_1.default.log({ 'level': 'error', 'message': "".concat(error_1) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function findGitHubRepoUrl(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, packageMetadata, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://registry.npmjs.org/".concat(packageName))];
                case 1:
                    response = _a.sent();
                    if (response.status !== 200) {
                        run_1.default.log({ 'level': 'error', 'message': "Failed to fetch package metadata for ".concat(packageName) });
                        return [2 /*return*/, 'none'];
                    }
                    packageMetadata = response.data;
                    //console.log(packageMetadata.repository);
                    //console.log(packageMetadata.repository.url);
                    // Check if the "repository" field exists in the package.json
                    if (packageMetadata.repository && packageMetadata.repository.url) {
                        return [2 /*return*/, 'https://' + packageMetadata.repository.url.match(/github\.com\/[^/]+\/[^/]+(?=\.git|$)/)];
                    }
                    else {
                        run_1.default.log({ 'level': 'error', 'message': "No repository URL found for ".concat(packageName) });
                        return [2 /*return*/, 'none'];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    run_1.default.log({ 'level': 'error', 'message': "".concat(error_2) });
                    return [2 /*return*/, 'none'];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.findGitHubRepoUrl = findGitHubRepoUrl;
// Function to count words in a string
function countWords(text) {
    var words = text.split(/\s+/);
    var nonEmptyWords = words.filter(function (word) { return word !== ''; });
    return nonEmptyWords.length;
}
exports.countWords = countWords;
// Function to calculate the score based on word count
function calculate_ramp_up_metric(wordCount, maxWordCount) {
    var maxScore = 1.0; // Maximum score
    // Calculate the score based on the word count relative to the max word count
    return Math.min(wordCount / maxWordCount, maxScore);
}
exports.calculate_ramp_up_metric = calculate_ramp_up_metric;
function findAllFiles(directory) {
    var allFiles = [];
    var codeExtensions = ['.ts']; //NEED TP MAKE THIS WORK FOR ALL DIFFERENT TYPES OF FILES BUT RIGHT NOW IT ONLY GOES THROUGH .TS FILES
    function traverseDirectory(currentDir) {
        var files = fs.readdirSync(currentDir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var filePath = (0, path_1.join)(currentDir, file);
            var stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                // Recursively traverse subdirectories
                traverseDirectory(filePath);
            }
            else if (codeExtensions.includes((0, path_1.extname)(filePath))) {
                allFiles.push(filePath);
            }
        }
    }
    traverseDirectory(directory);
    return allFiles;
}
exports.findAllFiles = findAllFiles;
function calculate_correctness_metric(filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var eslint, allFiles, results, totalIssues, _i, _a, result, lintScore, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    eslint = new eslint_1.ESLint();
                    allFiles = findAllFiles(filepath);
                    results = eslint.lintFiles(allFiles);
                    totalIssues = 0;
                    _i = 0;
                    return [4 /*yield*/, results];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    result = _a[_i];
                    totalIssues += result.errorCount + result.warningCount;
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4:
                    lintScore = 1 - Math.min(1, totalIssues / 1000.0);
                    return [2 /*return*/, lintScore];
                case 5:
                    error_3 = _b.sent();
                    //console.error('Error running ESLint:', error);
                    return [2 /*return*/, 0]; // Return 0 in case of an error
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.calculate_correctness_metric = calculate_correctness_metric;
function license_ramp_up_metric(repoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var tempDir, repoDir, license_met, ramp_up_met, correctness_met, url, parts, readmePath, readmeContent, _i, compatibleLicenses_1, compatibleLicense, wordCount, maxWordCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempDir = tmp.dirSync();
                    repoDir = tempDir.name;
                    license_met = 0;
                    ramp_up_met = 0;
                    correctness_met = 0;
                    //looks into tmpdir to make a temporay directory and then deleting at the end of the function 
                    //console.log(repoDir);
                    fse.ensureDir(repoDir); //will make sure the directory exists or will create a new one
                    url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
                    parts = url.split('/');
                    if (!(parts[0] === 'npmjs.com')) return [3 /*break*/, 2];
                    return [4 /*yield*/, findGitHubRepoUrl(parts[2])];
                case 1:
                    //console.log("This is a npmjs url");
                    //finds the github url of the npmjs module
                    //console.log(`This is the npmjs package ${parts[2]}`);
                    repoURL = _a.sent();
                    if (repoURL == null) {
                        //console.log(`This npmjs is not stored in a github repository.`);
                        return [2 /*return*/, [license_met, ramp_up_met, correctness_met]];
                    }
                    _a.label = 2;
                case 2: 
                //console.log(repoURL);
                //probably need to add in something to check if the url is from github just to make sure 
                return [4 /*yield*/, cloneRepository(repoURL, repoDir)];
                case 3:
                    //console.log(repoURL);
                    //probably need to add in something to check if the url is from github just to make sure 
                    _a.sent(); //clones the repository
                    readmePath = "".concat(repoDir, "/Readme.md");
                    readmeContent = 'none';
                    if (fs.existsSync(readmePath)) {
                        readmeContent = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
                    }
                    else {
                        readmePath = "".concat(repoDir, "/readme.markdown");
                        if (fs.existsSync(readmePath)) {
                            readmeContent = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
                        }
                    }
                    //CALCULATES THE LICENSE SCORE 
                    for (_i = 0, compatibleLicenses_1 = compatibleLicenses; _i < compatibleLicenses_1.length; _i++) {
                        compatibleLicense = compatibleLicenses_1[_i];
                        if (readmeContent.match(compatibleLicense)) {
                            license_met = 1; //License found was compatible 
                        }
                    }
                    wordCount = countWords(readmeContent);
                    maxWordCount = 2000;
                    ramp_up_met = calculate_ramp_up_metric(wordCount, maxWordCount); //calculates the actual score
                    return [4 /*yield*/, calculate_correctness_metric(repoDir)];
                case 4:
                    //CALUCLATES THE CORRECTNESS SCORE
                    correctness_met = _a.sent();
                    //deletes the temporary directory that was made
                    try {
                        fse.removeSync(repoDir);
                        //console.log('Temporary directory deleted.');
                    }
                    catch (err) {
                        run_1.default.log({ 'level': 'error', 'message': "".concat(err) });
                    }
                    return [2 /*return*/, ([license_met, ramp_up_met, correctness_met])];
            }
        });
    });
}
exports.license_ramp_up_metric = license_ramp_up_metric;
