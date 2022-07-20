const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');


const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;
console.log(highScores);

finalScore.innerText = mostRecentScore;
username.addEventListener('keyup' , () =>{
    saveScoreBtn.disabled = !username.value;

})

saveHighScore = (event) => {
console.log('save button clicked');
event.preventDefault();

const score = {
    score:Math.floor( Math.random() * 100),
    name:username.value
};

// push the new scores and username to highScore array
highScores.push(score);
// sort from highest to lowest
highScores.sort((a,b) => {
    return b.score - a.score;
});
// splice out the extra entry
highScores.splice(5);

localStorage.setItem('highScores', JSON.stringify(highScores));

window.location.assign('/');
console.log(highScores);

}