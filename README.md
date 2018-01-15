# easy-web-crawler
A node web crawler library

## prerequisite
    * Redis (4.0.6)
    * Node (v8.9.1)/npm(5.6.0)

    > The version inside the brackets are my local machine version.

## Instruction
    * run npm install on a terminal in the project directory.
    * run redis-server (with default password and port)
    * run npm test
    * modify the test.js in ./test folder to parse various url.

## Algorithms
   * A start url is seeded.
   * Links from the current url is fetched.
   * The links are stored in a redis sorted set with a score of occurance
   * The visited links is tracked on a redis set data structure.
   * The links with the highest frequency is selected as the next start url
   * The program run in a loop, while the numeberOfSeededUrl < numberOfRequestedUrl.
   * Specific domain can be ignored by
   ``` javascript
    let  applicationConfig = new config();
            applicationConfig.denyDomain = ['www.youtube.com'];
            ```
    The above code will ignore all www.youtube.com domain.
    
    > It will match other sub-domain of youtube.com.