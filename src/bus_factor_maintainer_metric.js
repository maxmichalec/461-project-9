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
exports.bus_factor_maintainer_metric = void 0;
var run_1 = require("./run");
var graphql_1 = require("@octokit/graphql");
var license_ramp_up_metric_1 = require("./license_ramp_up_metric");
var node_fetch_1 = require("node-fetch");
function bus_factor_maintainer_metric(repoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var bus_factor, responsive_maintainer, url, sections, query, gqlRequest, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bus_factor = 0;
                    responsive_maintainer = 0;
                    url = repoURL.replace(/^(https?:\/\/)?(www\.)?/i, '');
                    sections = url.split('/');
                    if (!(sections[0] === 'npmjs.com')) return [3 /*break*/, 2];
                    run_1.default.log({ 'level': 'info', 'message': "npmjs package: ".concat(sections[2]) });
                    return [4 /*yield*/, (0, license_ramp_up_metric_1.findGitHubRepoUrl)(sections[2])];
                case 1:
                    // Find the GitHub URL for the package
                    repoURL = _a.sent();
                    if (repoURL === 'none') {
                        run_1.default.log({ 'level': 'error', 'message': "This npmjs package is not stored in a GitHub repository." });
                        return [2 /*return*/, [bus_factor, responsive_maintainer]];
                    }
                    _a.label = 2;
                case 2:
                    run_1.default.log({ 'level': 'info', 'message': "GitHub repository: ".concat(repoURL) });
                    query = "\n\t\t{\n\t\t\trepository(owner: \"".concat(sections[1], "\", name: \"").concat(sections[2], "\") {\n\t\t\t\tpullRequests(last: 3, orderBy: {field: CREATED_AT, direction: DESC}) {\n\t\t\t\t\tnodes {\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tcollaborators {\n\t\t\t\t\ttotalCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t");
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, graphql_1.graphql)(query, {
                            headers: {
                                authorization: "token ".concat(process.env.GITHUB_TOKEN),
                            },
                            request: {
                                fetch: node_fetch_1.default,
                            },
                        })];
                case 4:
                    gqlRequest = _a.sent();
                    // Iterate through (up to 3) PRs to calculate part of responsive maintainer metric
                    gqlRequest.repository.pullRequests.nodes.forEach(function (pullRequest) {
                        responsive_maintainer += 0.16;
                        run_1.default.log({ 'level': 'info', 'message': "Pull request created at: ".concat(pullRequest.createdAt) });
                    });
                    // Factor in number of collaborators to calculate part of responsive maintainer metric
                    responsive_maintainer += Math.min(0.5, gqlRequest.repository.collaborators.totalCount / 15);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    run_1.default.log({ 'level': 'error', 'message': "Error fetching GitHub repository: ".concat(error_1) });
                    return [2 /*return*/, [0, 0]];
                case 6: return [2 /*return*/, [bus_factor, responsive_maintainer]];
            }
        });
    });
}
exports.bus_factor_maintainer_metric = bus_factor_maintainer_metric;
