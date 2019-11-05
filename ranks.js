const axios = require("axios");
const argv = require("minimist")(process.argv.slice(2));

const getArg = (short, long) => {
  if (argv[short] != null) return argv[short];
  if (argv[long] != null) return argv[long];
  return null;
};
const weekArg = getArg("w", "week");

const get = async week => {
  try {
    const req = await axios.get(
      `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/rankings?year=2019&poll=1&week=${week}&seasontype=2`
    );
    const { ranks: top25, others } = req.data.rankings.find(
      ranking => ranking.type === "ap"
    );

    const scrapeRanks = toScrape => {
      return toScrape.reduce((prev, curr) => {
        const {
          team: { location: teamName },
          points,
          firstPlaceVotes,
          recordSummary,
          previous
        } = curr;
        return `${prev}\n ${teamName},${points},${
          firstPlaceVotes === 0 ? " " : "'(" + firstPlaceVotes + ")"
        },${recordSummary === "0-0" ? " " : recordSummary},${
          previous === 0 ? "NR" : previous
        }`;
      }, "");
    };

    console.log(`${scrapeRanks(top25)}\n${scrapeRanks(others)}`);
  } catch (e) {
    console.log(e);
  }
};
get(weekArg);
