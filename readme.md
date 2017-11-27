## Node NCAA scraper

Scrape and output game information for a given date.

### How to use locally

First, clone the repo from github and install dependencies through npm.

```
git clone https://github.com/bricksroo/ncaa-scraper-js.git
cd ncaa-scraper-js
npm i
```

##### Scores - scrape.js
```node scrape.js {date}```

* `date` - date in YYYYMMDD format

Example: `node scrape.js 20171122`

This will output a comma separated list with the game info for the provided date.

```
Time, Away Team, Away Score, Home Team, Home Score
```

* Games are ordered first by rank and then by start time.
* Scores are only given in output if the game is final. Otherwise the score is left blank.

##### AP Rankings - ranks.js
`node ranks.js {week}`

* `week` - week number for ranking

Example: `node ranks.js 4`

This will output a comma separated list in the following form

```
Team, Points, First Place Votes, Record, Previous
```

* A new line gap separates top 25 teams from "Others receiving votes" teams
