## Node NCAA scraper

Scrape and output NCAA Mens Basketball information.

### How to use locally

First, clone the repo from github and install dependencies through npm.

```
git clone https://github.com/bricksroo/ncaa-scraper-js.git
cd ncaa-scraper-js
npm i
```

---

### Scores - scores.js

Get games for either a single date or week of the season.

**Date scores**

`--date`, `-d`: get games for a single date (YYYYMMDD format).

Example: `node scores.js -d=20171122`

**Week scores**

`--week`, `-w`: get games for a given week of the season.

Example: `node scores.js -w=14`

The `scores.js` file will output a comma separated list to the console in the following form

```
Date, Time, Away Team, Away Score, Home Team, Home Score
```

* Games are ordered first by rank and then by start time.
* Scores are only given in output if the game is final. Otherwise the score is left blank.

---

### AP Rankings - ranks.js

`--week`, `-w`: Get AP Rankings for either a week of the season.

Example: `node ranks.js -w=4`

The `ranks.js` file will output a comma separated list to the console in the following form

```
Team, Points, First Place Votes, Record, Previous
```

* A new line gap separates top 25 teams from "Others receiving votes" teams

---

### To-Do

* Make season adjustable in week scores request. Currently hard-coded to 2018.
