function get(type, games){
  games.forEach((game, i) => {
    // forcing each entry to show in console by adding an alternating value to the string
    const x = (i % 2 != 0 ? 1 : 2);
    console.log(`${x} ${game[type]}`);
  });
}

let gameNodes = document.querySelectorAll('.sb-score');
let games = []
gameNodes.forEach((game)=>{
  const awayTeam = game.querySelector('td.away .sb-team-short');
  const awayRank = game.querySelector('td.away .rank');
  const awayScore = game.querySelector('tr.away .total span');
  const homeTeam = game.querySelector('td.home .sb-team-short');
  const homeRank = game.querySelector('td.home .rank');
  const homeScore = game.querySelector('tr.home .total span');
  const time = game.querySelector('.time');

  games.push({
    aR: awayRank ? awayRank.textContent: false,
    aT: awayTeam.textContent,
    aS: awayScore ? awayScore.textContent: false,
    hR: homeRank ? homeRank.textContent: false,
    hT: homeTeam.textContent,
    hS: homeScore ? homeScore.textContent: false,
    time: time ? time.textContent.slice(0,-3): 'final',
  });
});

// split into ranked and nonranked
const rankedGames = games.filter((game) => game.aR || game.hR);
const nonRankedGames = games.filter((game) => !(game.aR || game.hR));

// sort by rank (1 = highest)
rankedGames.sort((a,b) => {
  function highestRank(x) {
    if(x.aR && x.hR){
      return Math.min(x.aR, x.hR).toString();
    } else if (x.aR) {
      return x.aR;
    } else {
      return x.hR;
    }
  }
  return highestRank(a) - highestRank(b);
});

const all = [...rankedGames,...nonRankedGames];
clear();