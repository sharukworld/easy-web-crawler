# easy-web-crawler
A node web crawler library

## prerequisite
    * Redis
    * Node/npm

## Instruction
    * run npm install on a terminal in the project directory.
    * run redis-server (with default password and port)
    * run npm test
    * modify the test.js in ./test folder to parse various url.

## Algorithms
   * A start url is seeded.
   * Links from the current url is fetched.
   * The links with the highest frequency is selected as the next start url
   * The program run in a loop, while the numeberOfSeededUrl < numberOfRequestedUrl.