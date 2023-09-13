import { execSync } from 'child_process';

function getLintScore(): number {
  try {
    // Run ESLint and capture its output
    const eslintOutput = execSync('eslint .', { encoding: 'utf-8' });

    // Count the number of errors and warnings in the ESLint output
    const errorCount = (eslintOutput.match(/error/g) || []).length;
    const warningCount = (eslintOutput.match(/warning/g) || []).length;

    // Calculate the total number of issues (errors + warnings)
    const totalIssues = errorCount + warningCount;

    // Calculate the lint score as a value between 0 and 1
    const lintScore = 1 - Math.min(1, totalIssues / 100);

    return lintScore;
  } catch (error) {
    console.error('Error running ESLint:', error);
    return 0; // Return 0 in case of an error
  }
}

const score = getLintScore();
console.log('Lint Score:', score);
process.exit(score > 0.5 ? 1 : 0); // Exit with status code 1 if lint score > 0.5, else 0


//Dev Notes -rossmr

//npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript

//ES-Lint formally TS-Lint, packages downloaded from above npm

//compile 
//npx tsc lint-score.ts

//run
//node lint-score.js

