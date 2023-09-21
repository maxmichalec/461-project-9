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
exports.bus_factor_maintainer_metric = exports.calculateResponsiveMaintainer = exports.calculateBusFactor = exports.fetchResponse = exports.fetchContributors = void 0;
var run_1 = require("./run");
var license_ramp_up_metric_1 = require("./license_ramp_up_metric");
var node_fetch_1 = require("node-fetch");
// Function to fetch contributors from GitHub API
function fetchContributors(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                            headers: {
                                //authorization: `token ${authToken}`,
                                authorization: "token ".concat(process.env.GITHUB_TOKEN),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status !== 200) {
                        run_1.default.log({ 'level': 'error', 'message': "Failed to fetch GitHub contributors: Response ".concat(response.status) });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    run_1.default.log({ 'level': 'error', 'message': "Error fetching GitHub contributors: ".concat(error_1) });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchContributors = fetchContributors;
// Function to fetch contributors from GitHub API
function fetchResponse(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                            headers: {
                                //authorization: `token ${authToken}`,
                                authorization: "token ".concat(process.env.GITHUB_TOKEN),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status !== 200) {
                        run_1.default.log({ 'level': 'error', 'message': "Failed to fetch GitHub contributors: Response ".concat(response.status) });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, response];
                case 2:
                    error_2 = _a.sent();
                    run_1.default.log({ 'level': 'error', 'message': "Error fetching GitHub contributors: ".concat(error_2) });
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.fetchResponse = fetchResponse;
// Function to calculate bus factor based on contributors
function calculateBusFactor(contributors) {
    var busFactor = 0;
    contributors.forEach(function (contributor) {
        busFactor += 0.1 * Math.min(contributor.contributions / 30, 1);
        run_1.default.log({ 'level': 'info', 'message': "Contributor login: ".concat(contributor.login) });
    });
    return busFactor;
}
exports.calculateBusFactor = calculateBusFactor;
// Function to calculate responsive maintainer based on contributors and last page
function calculateResponsiveMaintainer(contributors, lastPage) {
    var contributorsFactor = Math.min(0.5, lastPage / 15);
    // Add your calculation logic here based on contributors
    return contributorsFactor;
}
exports.calculateResponsiveMaintainer = calculateResponsiveMaintainer;
function bus_factor_maintainer_metric(repoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var busFactor, responsiveMaintainer, url, sections, topContributorsURL, contributors, contributorsPerPageURL, contributorsPerPage, response, header, matchResult, lastPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    busFactor = 0;
                    responsiveMaintainer = 0;
                    url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
                    sections = url.split('/');
                    if (!(sections[0] === 'npmjs.com')) return [3 /*break*/, 2];
                    run_1.default.log({ 'level': 'info', 'message': "npmjs package: ".concat(sections[2]) });
                    return [4 /*yield*/, (0, license_ramp_up_metric_1.findGitHubRepoUrl)(sections[2])];
                case 1:
                    // Find the GitHub URL for the package
                    repoURL = _a.sent(); // You need to implement findGitHubRepoUrl
                    if (repoURL === 'none') {
                        run_1.default.log({ 'level': 'error', 'message': "This npmjs package is not stored in a GitHub repository." });
                        return [2 /*return*/, [0, 0]];
                    }
                    _a.label = 2;
                case 2:
                    // Check if the URL is a valid GitHub repository URL
                    if (!repoURL.match(/^(https:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+$/i)) {
                        run_1.default.log({ 'level': 'error', 'message': "Invalid GitHub repository URL: ".concat(repoURL) });
                        return [2 /*return*/, [0, 0]];
                    }
                    run_1.default.log({ 'level': 'info', 'message': "GitHub repository: ".concat(repoURL) });
                    topContributorsURL = "https://api.github.com/repos/".concat(sections[1], "/").concat(sections[2], "/contributors?per_page=10");
                    return [4 /*yield*/, fetchContributors(topContributorsURL)];
                case 3:
                    contributors = _a.sent();
                    if (contributors === null) {
                        return [2 /*return*/, [0, 0]];
                    }
                    busFactor = calculateBusFactor(contributors);
                    contributorsPerPageURL = "https://api.github.com/repos/".concat(sections[1], "/").concat(sections[2], "/contributors?per_page=1&anon=1");
                    return [4 /*yield*/, fetchContributors(contributorsPerPageURL)];
                case 4:
                    contributorsPerPage = _a.sent();
                    if (contributorsPerPage === null) {
                        return [2 /*return*/, [0, 0]];
                    }
                    return [4 /*yield*/, fetchResponse(contributorsPerPageURL)];
                case 5:
                    response = _a.sent();
                    if (response === null) {
                        return [2 /*return*/, [0, 0]];
                    }
                    header = response.headers.get('link');
                    if (header) {
                        matchResult = header.match(/page=(\d+)>; rel="last"/);
                        if (matchResult) {
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
                    return [2 /*return*/, [busFactor, responsiveMaintainer]];
            }
        });
    });
}
exports.bus_factor_maintainer_metric = bus_factor_maintainer_metric;
