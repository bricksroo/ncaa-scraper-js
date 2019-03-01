const axios = require('axios')

const get = async () => {
  try {
    const req = await axios.get(
      `https://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?region=us&lang=en&contentorigin=espn&limit=400&groups=50&groupType=conference&enable=groups`
    )

    const allTeams = req.data.sports[0].leagues[0].groups.reduce((accu, curr) => {
      const confTeams = curr.teams.map(team => {
        
        return [team.id, team.nickname, team.location, team.name, team.displayName, team.shortDisplayName, team.abbreviation]
      })
      return [...accu, ...confTeams]
    }, [])

    console.log(allTeams.join('\n'))
  } catch (e) {
    console.log(e)
  }
}
get()
