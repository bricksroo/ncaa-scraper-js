## Node NCAA scraper

Scrape and output game information for a given date.

### How to use locally

Clone the repo from github and install dependencies through npm.

```
git clone https://github.com/bricksroo/ncaa-scraper-js.git
cd ncaa-scraper-js
npm i
```

After dependencies are installed, run `scrape.js` with a provided date (YYYYMMDD format).

`node scrape.js 20171122`

This will output a comma separated list with the game info for the provided date.
```
Time, Away Team, Away Score, Home Team, Home Score
```

* Games are ordered first by rank and then by start time.
* Scores are only given in output if the game is final. Otherwise the score is left blank.