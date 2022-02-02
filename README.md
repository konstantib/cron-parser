# Introduction

This is a Node project, so to use it make sure you have the latest version of Node installed.
If you are on OSX and using Homebrew you can install it like `brew install node`.

This project was created using `npx gts init`.

# Building the project
You can build the project by running `npm i` in the root directory.
This will pull all the dependencies `node_modules` and compile source code into `build` directory.

# Running the project
You can run the project using the following command `node build/src/index.js "your_cron_expression"` where `your_cron_expression` is custom value, for example `node build/src/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"`.

# Testing the project
The logic in this project is covered by unit tests. You can run the test by using command `npm run test`.

# Further Improvements
## Typescript compatibility
When running tests you can notice a message saying "WARNING: You are currently running a version of TypeScript which is not officially supported". This is a known issue introduced by `gts` dependencies. While not affecting functionality something to keep an eye out.

## Further refactoring
While I had time to refactor some of the logic on `subexpression.ts` some further improvements in `index.ts` could be made.

## CLI Input
I've left this part to the last, but could definitely use more some validation and better user experience

## Output format
Currently prints an array directly to the console. Can be improved by maintaining a fixed size array (a.k.a table) as per requirements and prettifying the output.

## Further unit testing
Covering more edge case scenarios.