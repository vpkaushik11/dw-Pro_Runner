const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let avenger;
let chitauri = [];
let speed;
let keys = {};

let score;
let scoreText = document.getElementById('Score');
let highscore;
let highscoreText = document.getElementById('HighScore');
let gravity;
let holes = [];
let h;

document.addEventListener('keydown', function(e){
    keys[e.code] = true;
});
document.addEventListener('keyup', function(e){
    keys[e.code] = false;
});
let h1 = canvas.height/2 - 100;
let h2 = canvas.height/2 + 100;


class Avenger{
    constructor (x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;
  
      this.dy = 0;
      this.jumpForce = 15;
      this.originalHeight = h;
      this.grounded = false;
      this.topped = false;
      this.jumpTimer = 0;
      this.state = 'down';
    }
  
    Animate () {
      // Jump
      if (keys['Space'] || keys['KeyW']) {
        this.Jump();
      } else {
        this.jumpTimer = 0;
      }
  
      if (keys['ShiftLeft'] || keys['KeyS']) {
        this.h = this.originalHeight / 2;
        this.y = h2 - h
      } else {
        this.h = this.originalHeight;
      }
      this.Draw();
    }
  
    Jump () {
      if (this.state == 'down') {
        this.y =  h1;
        this.state = 'up';
      } else{
        this.y = h2 - 50;
        this.state =  'down';
      }
    }
  
    Draw () {
      // ceiling
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, h1);
      ctx.fillStyle = 'rgb(65, 65, 65)';
      ctx.fill();
      ctx.closePath();

      // ground
      ctx.beginPath();
      ctx.rect(0, h2, canvas.width, h1);
      ctx.fillStyle = 'rgb(65, 65, 65)';
      ctx.fill();
      ctx.closePath();

      // avenger
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.closePath();
    }
}

// for cracks in the ceiling and ground
class Crack {
  constructor() {
    this.x = canvas.width + 200;
    this.w = 300;
    this.c = '#404040';
    this.dx = -speed;
    let type = Math.round(Math.random());
    if(type === 1) {
      this.state = "up";
      this.y = 0;
      this.h = canvas.height/2 - 150;
    } else {
      this.state = "down"
      this.y = canvas.height/2 + 150;
      this.h = canvas.height/2 - 150;
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

// obstacles
class Obstacle {
    constructor (x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;
  
      this.dx = -speed;
    }
  
    Update () {
      this.x += this.dx;
      this.Draw();
      this.dx = -speed;
    }
  
    Draw () {
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.closePath();
    }
}

// Game Functions

// for spawning the obstacles
function SpawnObstacle () {
    let size = RandomIntInRange(20, 150);
    let size2 = RandomIntInRange(30, 70);
    let type = RandomIntInRange(0, 1);
    let soldier = new Obstacle(canvas.width + size, h2 - size, size2, size2, 'red');
  
    if (type == 1) {
      soldier.y -= avenger.originalHeight - 10;
    }
    chitauri.push(soldier);
}

// for deplyong the ceiling gap
function crackhead(){
 // let size2 = RandomIntInRange(50, 100);
 // let gap = new Crack(canvas.width, 0, size2, h1, 'black');
    let hole = new Crack();
    console.log(holes);
    holes.push(hole);

  //hole.push(gap);
}


function RandomIntInRange (min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function Start () {
    speed = 3;
    gravity = 1;
    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')) {
      highscore = localStorage.getItem('highscore');
    }
    highscoreText.textContent = "HighScore: " + highscore;
    avenger = new Avenger (50, h2 - 50, 50, 50, 'rgb(0, 132, 255)');
  
    requestAnimationFrame(_Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function _Update () {
    requestAnimationFrame(_Update);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';  // trailing effect fills it with a translucent layer 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //_update();
    spawnTimer--;
    if (spawnTimer <= 0) {
      SpawnObstacle();
      crackhead();
      console.log(chitauri);
      console.log(holes);
      spawnTimer = initialSpawnTimer - speed * 8;
      
      if (spawnTimer < 60) {
        spawnTimer = 60;
      }
    }
  
    // Spawn Enemies
    for (let i = 0; i < chitauri.length; i++) {
      let o = chitauri[i];
  
      if (o.x + o.w < 0) {
        chitauri.splice(i, 1);
      }
  
      if (avenger.x < o.x + o.w && avenger.x + avenger.w > o.x && avenger.y < o.y + o.h && avenger.y + avenger.h > o.y) 
      {
        chitauri = [];
        alert(`GAME OVER\nScore = ${score}\nHigh-Score = ${highscore}`)
        score = 0;
        spawnTimer = initialSpawnTimer;
        //speed = 0;
        avenger.y = h2 - 50;
        //exit();
        window.localStorage.setItem('highscore', highscore);
      }
  
      o.Update();
    }

    for(let i=0; i<holes.length; i++) {
      h = holes[i];
      if(h.x + h.width < 0) {
        holes.splice(i, 1);
      }
      if((player.state == h.state) && (player.x + player.width > h.x) && (player.x < h.x + h.width)) {
        chitauri = [];
        hole = [];
        alert(`GAME OVER\nScore = ${score}\nHigh-Score = ${highscore}`)
        score = 0;
        spawnTimer = 200;
        avenger.y = h2 - 50;
        window.localStorage.setItem('highscore', highscore);
      }     
    }
    h.Update();
    avenger.Animate();
    score++;
    scoreText.textContent = "Score: " + score;

    if (score > highscore) {
      highscore = score;
      highscoreText.textContent = "Highscore: " + highscore;
    }
    
    speed += 0.003;
}

Start();
