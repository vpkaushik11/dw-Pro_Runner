const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let avenger;
let speed = 3;
let holes = [];
let Game = true;
let keys = {};

let score;
let scoreText = document.getElementById('Score');
let highscore;
let highscoreText = document.getElementById('HighScore');

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

document.addEventListener('keydown', function(e){
  keys[e.code] = true;
  if(keys['Space']){
    if(avenger.state === "down") {
      avenger.state = "up";
    } else {
      avenger.state = "down";
    }
  }
});

document.addEventListener('keyup', function(e){
  keys[e.code] = false;
});

canvas.addEventListener('click', function(e){
    if(avenger.state === "down") {
      avenger.state = "up";
    } else {
      avenger.state = "down";
    }
});

let h1 = canvas.height/2 - 100;
let h2 = canvas.height/2 + 100;

function RandomIntInRange (min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

class Avenger {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.state = "down";
  }
  Animate() {
    if(this.state === "down") {
      this.y = h2 - 50;
    } else {
      this.y = h1;
    }
    this.Draw();
  }
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

class Hole {
  constructor() {
    this.x = canvas.width + 200;
    this.w = 300;
    this.c = '#000000';
    this.dx = -speed;
    let type = Math.round(Math.random());
    if(type === 1) {
      this.state = "up";
      this.y = 0;
      this.h = h1;
    } else {
      this.state = "down"
      this.y = h2 - 50;
      this.h = h1 + 50;
    }
  }
  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -speed;
  }
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

// Game Functions
function GenerateHole() {
  let hole = new Hole();
  console.log(holes);
  holes.push(hole);
}

function Start() {
  avenger = new Avenger(50, h2 - 50, 50, 50, 'rgb(0, 132, 255)');
  score = 0;
  highscore = 0;
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }
  highscoreText.textContent = "HighScore: " + highscore;
  requestAnimationFrame(Update);
}

function Update() {
  if(Game) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, h1, canvas.width, 200);
    avenger.Animate();
    requestAnimationFrame(Update);
    spawnTimer--;
    if(spawnTimer <= 0) {
      GenerateHole();
      spawnTimer = initialSpawnTimer - speed * 8;
      if (spawnTimer < 60) {
        spawnTimer = 60;
      }
    }
    for(let i=0; i<holes.length; i++) {
      let h = holes[i];
      if(h.x + h.width < 0) {
        holes.splice(i, 1);
      }
      if((avenger.state == h.state) && (avenger.x + avenger.w > h.x) && (avenger.x < h.x + h.w)) {
        window.localStorage.setItem('highscore', highscore);
        console.log(score);
        alert(`GAME OVER\nScore = ${score}\nHigh-Score = ${highscore}`)
        spawnTimer = initialSpawnTimer;
        Game = false;
      }
      h.Update();
    }
    score++;
    scoreText.textContent = "Score: " + score;
    if(score > highscore) {
      highscore = score;
      highscoreText.textContent = "Highscore: " + highscore;
    }
    speed += 0.005;
  }
}

Start();