"use strict";
/*Will clean later: NOTES TO TEAM
This code returns a value between 0 and 1 as a ratio to the number
of errors and warnings outputted by ESLint. While Lint is primarly designed to run on libraries and depandices,
I cannot think of a better way to check our own code for correctness and code standard, we can discuss at our meeting tmmrw on Sept 14th.
NOTE: This code does not properally check error handling yet.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function getLintScore() {
    try {
        // Run ESLint and capture its output
        var eslintOutput = (0, child_process_1.execSync)('eslint .', { encoding: 'utf-8' });
        // Count the number of errors and warnings in the ESLint output
        var errorCount = (eslintOutput.match(/error/g) || []).length;
        var warningCount = (eslintOutput.match(/warning/g) || []).length;
        // Calculate the total number of issues (errors + warnings)
        var totalIssues = errorCount + warningCount;
        // Calculate the lint score as a value between 0 and 1
        var lintScore = 1 - Math.min(1, totalIssues / 100);
        return lintScore;
    }
    catch (error) {
        console.error('Error running ESLint:', error);
        return 0; // Return 0 in case of an error
    }
}
var score = getLintScore();
console.log('Lint Score:', score);
process.exit(score > 0.5 ? 1 : 0); // Exit with status code 1 if lint score > 0.5, else 0
//Dev Notes -rossmr
//npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
//ES-Lint formally TS-Lint, packages downloaded from above npm
//compile 
//npx tsc lint-score.ts
//run
//node lint-score.js
