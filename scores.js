const axios = require("axios");
const format = require("date-fns/format");
const getTime = require("date-fns/getTime");
const parseISO = require("date-fns/parseISO");
const argv = require("minimist")(process.argv.slice(2));

const getArg = (short, long) => {
  if (argv[short] != null) return argv[short];
  if (argv[long] != null) return argv[long];
  return null;
};

const getTeam = (comp, homeAway) =>
  comp.competitions[0].competitors.find(
    competitor => competitor.homeAway === homeAway
  );
const isRanked = team =>
  team.curatedRank.current !== 99 && team.curatedRank.current !== 0;

const groupByStartDate = arr => {
  return arr.reduce((acc, val, i) => {
    const startDate = format(
      parseISO(val.competitions[0].startDate),
      "yyyyMMdd"
    );
    acc[startDate] = (acc[startDate] || []).concat(arr[i]);
    return acc;
  }, {});
};

const sortRankVsNotRanked = events => {
  // sort games by highest ranked team participating 1 -> 25
  const ranked = events
    .filter(event => {
      return event.competitions[0].competitors.some(team => isRanked(team));
    })
    .sort((a, b) => {
      const highestRank = x => {
        const home = getTeam(x, "home");
        const away = getTeam(x, "away");
        if (isRanked(home) && isRanked(away)) {
          return Math.min(
            home.curatedRank.current,
            away.curatedRank.current
          ).toString();
        }
        return isRanked(home)
          ? home.curatedRank.current
          : away.curatedRank.current;
      };
      return highestRank(a) - highestRank(b);
    });

  // sort non-ranked games by start time
  const notRanked = events
    .filter(event => {
      return event.competitions[0].competitors.every(
        team => team.curatedRank.current === 99
      );
    })
    .sort((a, b) => {
      return (
        getTime(parseISO(a.competitions[0].startDate)) -
        getTime(parseISO(b.competitions[0].startDate))
      );
    });

  return [...ranked, ...notRanked];
};

const sortEvents = eventList => {
  const groupedByDate = groupByStartDate(eventList);
  return [].concat(
    ...Object.keys(groupedByDate).map(eventDay =>
      sortRankVsNotRanked(groupedByDate[eventDay])
    )
  );
};

const get = async () => {
  try {
    const req = await axios.get(reqUrl);
    const events = req.data.events;

    const scraped = sortEvents(events).reduce((prev, curr) => {
      const comp = curr.competitions[0];
      const home = getTeam(curr, "home");
      const away = getTeam(curr, "away");
      const date = format(parseISO(comp.startDate), "E, MMM d");
      const time =
        comp.status.type.detail === "Postponed"
          ? "Postponed"
          : format(parseISO(comp.startDate), "h:mm a");
      const final = comp.status.type.completed;
      const isConference = curr.competitions[0].conferenceCompetition;
      const isNeutral = curr.competitions[0].neutralSite;

      const thisGame = [
        date,
        time,
        away.team.location,
        away.score === "0" || !final ? " " : away.score,
        home.team.location,
        home.score === "0" || !final ? " " : home.score,
        isConference,
        isNeutral
      ];

      return `${prev}\n${thisGame.join("+")}`;
    }, "");
    console.log(scraped);
  } catch (e) {
    console.log(e);
  }
};

let reqUrl;
let dateArg = getArg("d", "date");
let weekArg = getArg("w", "week");

if (dateArg != null && weekArg != null) {
  console.error("Don't use both week and date flags together");
  return;
}

if (dateArg != null) {
  reqUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?lang=en&region=us&calendartype=blacklist&limit=500&dates=${dateArg.toString()}&tz=America/New_York&groups=50`;
}

if (weekArg != null) {
  reqUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?lang=en&region=us&calendartype=blacklist&limit=500&dates=2020&tz=America/New_York&groups=50&week=${weekArg.toString()}`;
}

get();
