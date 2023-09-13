# 461-project-9
Names: 
- Madi Arnold
- Michael Ross
- Maxwell Michalec
- Caroline Gilbert

Commnad Line Interface:
The command line interface can be found within the run and run.ts files.  The run file is in the main directory and is a bash script file.  The file looks to see what was entered by the user.  If user wants the npm modules to be installed then it will do that.  If the user doesn't want the modules to be installed, then the code will be compiled and ran with the user input.  This runs the run.ts file where either a file with URLs is entered or tests need to be ran.  The run.ts file will call all the other functions for the metric caluclations and output the needed data.  

License Metric Calculation:
The license_ramp_up_metric.ts file is found in the src folder.  This file houses the function that will calculate the License Metric.  This function will clone the git repository locally and then look at the README.md file.  In the README.md file, it will look for the "License" header and find out what License it has, and either return a 1 for a License that works or a 0 for a License that doesn't work. 

Ramp-Up Metric Calculation: 
The license_ramp_up_metric.ts file is found in the src folder.  This file houses the function that will calculate the License Metric.  This function will clone the git repository locally and then look the the README.md file.  It will look at the total number of words in the README.md file to calculate a score for the Ramp-Up metric between 0 and 1.

Correctness Metric Calulation:
The lint-score.ts file is found in the src folder. The file contains the function taht calculates the correctness score. It will execute esLint at the core. It will then take the number of errors and warnings returned and calculate a score for the Correctness metric between 0 and 1.

Packages:
- fs
- fs-extra
- isomorphic-git
- axios
- tmp


We should add documentation as we devolp.
