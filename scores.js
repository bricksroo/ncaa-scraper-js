const axios = require('axios')
const format = require('date-fns/format')
const getTime = require('date-fns/get_time')

const dateArg = process.argv[2]

const getTeam = (comp, homeAway) => comp.competitions[0].competitors.find(competitor => competitor.homeAway === homeAway)
const isRanked = (team) => team.curatedRank.current !== 99 && team.curatedRank.current !== 0

const get = async (date) => {
  try {
    const req = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?lang=en&region=us&calendartype=blacklist&limit=500&dates=${date}&tz=America/New_York&groups=50`)
    const events = req.data.events

    const ranked = req.data.events.filter(event => {
        return event.competitions[0].competitors.some(team => isRanked(team))
      }).sort((a, b) => {
        const highestRank = (x) => {
          const home = getTeam(x, 'home')
          const away = getTeam(x, 'away')
          if (isRanked(home) && isRanked(away)) {
            return Math.min(home.curatedRank.current, away.curatedRank.current).toString();
          } 
          return isRanked(home) ? home.curatedRank.current : away.curatedRank.current
        }
        return highestRank(a) - highestRank(b)
      })

    const notRanked = req.data.events.filter(event => {
        return event.competitions[0].competitors.every(team => team.curatedRank.current === 99)
      }).sort((a, b) => {
        return getTime(a.competitions[0].startDate) - getTime(b.competitions[0].startDate)
      });

    const sortedEvents = [
      ...ranked,
      ...notRanked
    ]

    const scraped = sortedEvents.reduce((prev, curr) => {
      const comp = curr.competitions[0]
      const home = getTeam(curr, 'home')
      const away = getTeam(curr, 'away')
      const date = format(new Date())
      const time = comp.status.type.detail === 'Postponed' ? 'Postponed' : format(new Date(comp.startDate), 'h:mm A')
      const final = comp.status.type.completed
      const isConference = curr.competitions[0].conferenceCompetition
      
      return `${prev}\n ${time},${away.team.location},${away.score === '0' || !final ? ' ' : away.score},${home.team.location},${home.score === '0' || !final ? ' ' : home.score},${isConference}`
    }, '');
    console.log(scraped)
  } catch (e) {
    console.log(e)
  }
}
get(dateArg)