// copy the code below on the ESPN score page
let gameNodes = document.querySelectorAll('.sb-score');
let games = []
gameNodes.forEach((game)=>{
  const awayTeam = game.querySelector('td.away .sb-team-short');
  const awayRank = game.querySelector('td.away .rank');
  const homeTeam = game.querySelector('td.home .sb-team-short');
  const homeRank = game.querySelector('td.home .rank');
  const time = game.querySelector('.time');

  games.push({
    away:{
      team: awayTeam.textContent,
      rank: awayRank ? awayRank.textContent : '',
    },
    home:{
      team: homeTeam.textContent,
      rank: homeRank ? homeRank.textContent : '',
    },
    time: time.textContent
  });

});

console.log(games);
// sort by rank
games.sort((a, b) => {
  let aBiggerRank;
  if(a.away.rank && a.home.rank){
    aBiggerRank = Math.min(a.away.rank, a.home.rank);
  } else if(a.away.rank) {
    aBiggerRank = parseInt(a.away.rank)
  } else {
    aBiggerRank = parseInt(a.home.rank)
  }

  let bBiggerRank;
  if(b.away.rank && b.home.rank){
    bBiggerRank = Math.min(b.away.rank, b.home.rank);
  } else if(b.away.rank) {
    bBiggerRank = parseInt(b.away.rank);
  } else {
    bBiggerRank = parseInt(b.home.rank);
  }
  // const aBiggerRank = Math.min(a.away.rank, a.home.rank);
  // const bBiggerRank = Math.min(b.away.rank, b.home.rank);
  // const aBiggerRank = ((a.away.rank || a.home.rank) && a.away.rank > a.home.rank) ? a.away.rank : a.home.rank ;
  // const bBiggerRank = ((b.away.rank || b.home.rank) && b.away.rank > b.home.rank) ? b.away.rank : b.home.rank ;
  console.log(aBiggerRank,"A");
  console.log(bBiggerRank,"B");
  return aBiggerRank > bBiggerRank;
});

console.log(games);
