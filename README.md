# 461-project-9
Names: 
- Madi Arnold
- Michael Ross
- Maxwell Michalec
- Caroline Gilbert

Overview: Our CLI system has the ability to install the required system dependencies, run a test suite, and evaluate the inputted GitHub or NPM repository URLs net score based on the following metrics: ramp-up time, correctness, bus factor, maintainer responsiveness, and license compatibility. The license metric is calculated as a binary score (1 or 0) describing a valid license, and the ramp-up metric is designed to base the score relative to the number of words in the README.md file between 0 and 1. In addition, the bus factor score is calculated using a GitHub REST API query to get the top 10 contributors’ number of commits to the repository and sum their individual impact to output a score between 0 and 1. Furthermore, the maintainer responsiveness metric is calculated using the REST API query to get the total number of contributors and a GitHub GraphQL API query to get information on the 5 most recent pull-requests to calculate the metric score between 0 and 1 that favors repositories with more recent updates. The correctness score is calculated using esLint to return a score between 0 and 1 based on the number of errors and warnings. Lastly, the system utilizes the Jest testing framework to run a series of test suites that have unit tests for each of the functions implemented in the metric calculation files and the run file, and the system utilizes GitHub Actions as a CI tool to execute a workflow that runs the system install, test, and URL_FILE commands on each push event.  

**Commnad Line Interface:**
The command line interface can be found within the `run` and `run.ts` files.  The `run` file is in the main directory and is a bash script file.  The file looks to see what was entered by the user.  If user wants the npm modules to be installed then it will do that.  If the user doesn't want the modules to be installed, then the code will be compiled and ran with the user input.  This runs the `run.ts` file where either a file with URLs is entered or tests need to be ran.  The `run.ts` file will call all the other functions for the metric caluclations and output the needed data.  

**License Metric Calculation:**
The `license_ramp_up_metric.ts` file is found in the `src` folder.  This file houses the function that will calculate the License Metric.  This function will clone the git repository locally and then look at the README.md file.  In the README.md file, it will look for the "License" header and find out what License it has, and either return a 1 for a License that works or a 0 for a License that doesn't work. 

**Ramp-Up Metric Calculation:**
The `license_ramp_up_metric.ts` file is found in the `src` folder.  This file houses the function that will calculate the License Metric.  This function will clone the git repository locally and then look the the README.md file.  It will look at the total number of words in the README.md file to calculate a score for the Ramp-Up metric between 0 and 1.

**Correctness Metric Calulation:**
The `lint-score.ts` file is found in the `src` folder. The file contains the function that calculates the correctness score. It will execute esLint at the core. It will then take the number of errors and warnings returned and calculate a score for the Correctness metric between 0 and 1.

**Bus Factor Metric Calculation:**
The `bus_factor_maintainer.ts` file is found in the `src` folder. This file contains the function that calculates the bus factor (and responsive maintainer) score. It will use a GitHub REST API query to get the (up to 10) top contributors to the repository. It will use the number of commits that each of those contributors have made to calculate an impact for each of them which is summed to get the metric score which is between 0 and 1.

**Responsive Maintainer Metric Calculation:**
The `bus_factor_maintainer.ts` file is found in the `src` folder. This file contains the function that calculates the responsive maintainer (and bus factor) score. It will use a GitHub REST API query to get the total number of contributors to the repository and then a GitHub GraphQL API query to get information about the most recent 5 pull-requests. The number of contrubutors and the number of pull-requests are used to calculate the metric score which is between 0 and 1.

**Logging:**
The logger is instantiated in the `run.ts` file using the winston logger package. It is exported from `run.ts` and can be used in other files in the `src` directory by importing it: `import { logger } from './run';`. The logger can be used by calling `logger.log({'level': 'info'|'error', 'message': 'your message'});`, with 'info' and 'error' indicating severity level. The logger will log to the .env variable LOG_FILE or run.log if no LOG_FILE is specified. The logger's severity level can be set using the LOG_LEVEL .env variable, with LOG_LEVEL=0 disabling logging statements, LOG_LEVEL=1 logging only errors, and LOG_LEVEL=2 logging errors and info statements. If no LOG_LEVEL is specified, the logger will log both errors and info statements.

**Packages:**
- fs
- fs-extra - https://www.npmjs.com/package/fs-extra
- isomorphic-git - https://www.npmjs.com/package/isomorphic-git
- typescript - https://www.npmjs.com/package/typescript
- @types/node - https://www.npmjs.com/package/@types/node
- axios - https://www.npmjs.com/package/axios
    Dep - follow-redirects, form-data, proxy-from-env
- tmp - https://www.npmjs.com/package/tmp
    Dep - rimraf
- jest - https://www.npmjs.com/package/jest
    Dep - @jest/core, @jest/types, import-local, jest-cli
- eslint - https://www.npmjs.com/package/eslint
    Dep - @eslint-community/eslint-utils, @eslint-community/regexpp, @eslint/eslintrc, @eslint/js, @humanwhocodes/config-array, @humanwhocodes/module-importer, @nodelib/fs.walk, ajv, chalk, cross-spawn, debug, doctrin, eescape-string-regexp, eslint-scope, eslint-visitor-keys, espree, esquery, esutils, fast-deep-equal, file-entry-cache, find-up, glob-parent, globals, graphemer, ignore, imurmurhash, is-glob, is-path-inside, js-yaml, json-stable-stringify-without-jsonify, levn, lodash.merge, minimatch, natural-compare, optionator, strip-ansi, text-table
- @typescript-eslint/parser - https://www.npmjs.com/package/@typescript-eslint/parser
    Dep - @typescript-eslint/scope-manager, @typescript-eslint/types, @typescript-eslint/typescript-estree, @typescript-eslint/visitor-keys, debug
- @typescript-eslint/eslint-plugin - https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
    Dep - @eslint-community/regexp, @typescript-eslint/scope-manager, @typescript-eslint/type-utils, @typescript-eslint/utils@, typescript-eslint/visitor-keys, debug, graphemer, ignore, natural-compare, semver, ts-api-utils
- node-fetch - https://www.npmjs.com/package/node-fetch
    Dep - data-uri-to-buffer, fetch-blob, formdata-polyfill
- @octokit/graphql - https://www.npmjs.com/package/@octokit/graphql
    Dep - @octokit/request, @octokit/types, universal-user-agent
- dotenv - https://www.npmjs.com/package/dotenv
- winston - https://www.npmjs.com/package/winston
    Dep - @dabh/diagnostics, @colors/colors, async, is-stream, logform, one-time, readable-stream, safe-stable-stringify, stack-trace, triple-beam, winston-transport
- @types/jest - https://www.npmjs.com/package/@types/jest
    Dep - expect, pretty-format
- ts-jest - https://www.npmjs.com/package/ts-jest
    Dep - bs-logger, fast-json-stable-stringify, jest-util, json5, lodash.memoize, make-error, semver, yargs-parser
- istanbul-lib-coverage - https://www.npmjs.com/package/istanbul-lib-coverage
- istanbul-reports - https://www.npmjs.com/package/istanbul-reports
    Dep - html-escaper, istanbul-lib-report
- nyc - https://www.npmjs.com/package/nyc
    Dep - @istanbuljs/load-nyc-config, @istanbuljs/schema, caching-transform, convert-source-map, decamelize, find-cache-dir, find-up, foreground-child, get-package-type, glob, istanbul-lib-coverage, istanbul-lib-hook, istanbul-lib-instrument, istanbul-lib-processinfo, istanbul-lib-report, istanbul-lib-source-maps, istanbul-reports, make-dir, node-preload, p-map, process-on-spawn, resolve-from, rimraf, signal-exit, spawn-wra, test-exclude, yargs
- @types/node-fetch - https://www.npmjs.com/package/@types/node-fetch
    Dep - @types/node, form-data


