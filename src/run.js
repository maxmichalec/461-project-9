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
var fs = require("fs");
var license_ramp_up_metric_1 = require("./license_ramp_up_metric");
// Function to process URL_FILE and produce NDJSON output
function processUrls(urlFile) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, fileContents, urls, l_r_metric_array, number, _i, urls_1, url, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    filePath = urlFile;
                    fileContents = fs.readFileSync(filePath, 'utf-8');
                    urls = fileContents.split('\n').filter(function (url) { return url.trim() !== ''; });
                    l_r_metric_array = void 0;
                    number = 0;
                    _i = 0, urls_1 = urls;
                    _a.label = 1;
                case 1:
                    if (!(_i < urls_1.length)) return [3 /*break*/, 4];
                    url = urls_1[_i];
                    console.log("The URL that is currently running is ".concat(url));
                    return [4 /*yield*/, (0, license_ramp_up_metric_1.license_ramp_up_metric)(url, number)];
                case 2:
                    l_r_metric_array = _a.sent(); //returns license metric first and then ramp up metric
                    number = number + 1;
                    console.log('License Metric:', l_r_metric_array[0]);
                    console.log('Ramp Up Metric:', l_r_metric_array[1]);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error('Error:', err_1);
                    return [3 /*break*/, 6];
                case 6:
                    //console.log('Processing URLs...');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
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
if (args[0] == 'test') {
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
