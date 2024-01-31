const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE"; // color of an empty square
let isPaused = false;

// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// create the board

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their colors

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"purple"],
    [O,"yellow"],
    [L,"orange"],
    [I,"cyan"],
    [J,"blue"]
];

function drawUpcomingPiece(piece) {
    const upcomingPieceElement = document.getElementById('upcoming-piece');
    upcomingPieceElement.innerHTML = '';
    piece.tetromino.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          const square = document.createElement('div');
          square.style.width = '20px';
          square.style.height = '20px';
          square.style.backgroundColor = piece.color;
          upcomingPieceElement.appendChild(square);
        }
      });
    });
  }

// generate random pieces

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();
drawUpcomingPiece(p);

// The Object Piece

function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = -2;

    this.yPos = this.y;
}

// fill function

Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece


Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// move Down the piece

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;
let level = 0;

Piece.prototype.lock = function(callback){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;

            if (callback) {
                callback();
                drawUpcomingPiece(p);
            }
        }
    }

    let level = 1;
    let linesCleared = 0;
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;

            // Increase the lines cleared counter
            linesCleared++;

            // If the player has cleared 10 lines, increase the level and reset the counter
            if (linesCleared === 10) {
                level++;
                linesCleared = 0;

                
            }
        }
    }
            // update the board
            drawBoard();
    
            // update the score
            scoreElement.innerHTML = score;
            // Display the new level to the player
            levelElement.innerHTML = level;
}

// collision fucntion

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

Piece.prototype.hardDrop = function() {
    while (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
    this.lock();
    p = randomPiece();
};

// CONTROL the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }else if(event.keyCode == 80){
        isPaused = !isPaused;
        //console.log("HEllo here");
        //pauseCountdown();
        drop();
    }else if (event.keyCode == 32) { 
        // space bar key code
        p.hardDrop();
        dropStart = Date.now();
    }
}

document.addEventListener("keydown", END_GAME);

function END_GAME(event) {
  if (event.keyCode == 27) { // escape key
    gameOver = true;
    alert("GAME OVER");
  }
  // other key handling code...
}

document.getElementById("restart-button").addEventListener("click", function() {
    // Reset the game state
    board = [];
    for (r = 0; r < ROW; r++) {
      board[r] = [];
      for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
      }
    }
    score = 0;
    level = 0;
    p = randomPiece();
  
    // Redraw the board
    drawBoard();
  
    // Update the score and level displays
    scoreElement.innerHTML = score;
    levelElement.innerHTML = level;
  
    // Start the game again
    drop();
});

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;
let dropInterval = 1000;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000 && !isPaused) {
        p.moveDown();
        dropStart = now;
    }
    // In the drop function, before the requestAnimationFrame call
    if (!gameOver && !isPaused) {
        setTimeout(drop, dropInterval);
        dropInterval -= 100 * (level - 1);
        requestAnimationFrame(drop);
    }
}

let countdownElement = document.getElementById("countdown");

function countdown() {
    let count = 3;
  
    let countdownInterval = setInterval(function() {
      countdownElement.innerHTML = count;
      count--;
  
      if (count < 0) {
        clearInterval(countdownInterval);
        countdownElement.classList.add("hide"); // ajoutez cette ligne
        drop();
      }
    }, 1000);
}

function pauseCountdown() {
    if (isPaused) {
      return;
    }
    countdownElement.classList.remove("hide");
    showPauseCountdown(function() {
      isPaused = false;
      drop();
    });
}

function showPauseCountdown(callback) {
    let count = 3;
  
    let countdownInterval = setInterval(function() {
      countdownElement.innerHTML = count;
      count--;
  
      if (count < 0) {
        clearInterval(countdownInterval);
        countdownElement.classList.add("hide");
        callback();
      }
    }, 1000);
}

//Play button
document.getElementById("play-button").addEventListener("click", function() {
    countdown();
  });