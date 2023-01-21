var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasWidth = 1000;
var canvasHeight = 525;
var canvasBorderOffSet = 15;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var board = document.getElementById('board');
var ctx2 = board.getContext('2d');

var boardWidth = 200;
var boardHeight = 200;

board.width = boardWidth;
board.height = boardHeight;

var relativeX = 0;
var relativeY = 0;

var lost = false;
var win = false;
var paused = false;
var level = 1;

var score = 0;
var maxScore = 0;
var scoreCounter = 0;
var scoreVibrate = false;
var scoreOffSetX = 0;
var scoreRandom = 0;
var scoreVibrateTimer = 0;

function drawScore() {
	ctx2.clearRect(0, 0, board.width, board.height);
	
	if(scoreCounter >= 100 || scoreVibrate == true){
		scoreCounter = 0;
		scoreVibrate = true;
			
		scoreVibrateTimer++;
		
		if(scoreVibrate == true){
			
			scoreRandom = scoreRandom + 1;
			if(scoreRandom > 2){			//makes the score vibrate
				scoreRandom = 0;
			}
		}
		
		switch (scoreRandom){
			case 0:
				scoreOffSetX = 0;
				break;
			
			case 1:
				scoreOffSetX = -5;
				break;			
			
			case 2:
				scoreOffSetX = 5;
				break;
		}
		
		if(scoreVibrateTimer >= 20){
			scoreVibrateTimer = 0;
			scoreRandom = 0;
			scoreVibrate = false;
		}
	}
	
	ctx2.font = "bold 30px Arial";
	ctx2.fillStyle = "white";
	ctx2.fillText("Score", 0 + scoreOffSetX, 120);
	ctx2.fillText(score, 0 + scoreOffSetX, 150);
	scoreOffSetX = 0;
}

var lives = 3;		

var imglives = new Image();
	imglives.src = "../Resources/sprite_lifebar.png"; 
	
var livesWidth = 1072;
var livesHeight = 102;
var livesRatio = 2;
var livesFrames = 4;
var lifeFrame = 0;
var lifeBar = (livesWidth/livesFrames)
var lifeBlur = 0;
var flashing = false;

function drawLives() {
	
	if(lives == 1){
		if(flashing == false){
			lifeBlur = lifeBlur + 1;
			if (lifeBlur > 15){
				flashing = true;
			}
		}
	
		if(flashing == true){
			lifeBlur = lifeBlur - 1;
			
			if (lifeBlur == 0){
				flashing = false;
			}
		}
	}
	
	ctx2.shadowColor = "red";
	ctx2.shadowBlur = lifeBlur;
	ctx2.drawImage(imglives, lifeBar * lifeFrame, 0, lifeBar, livesHeight, 0, 40, livesWidth/4 / livesRatio, livesHeight / livesRatio);
	
	ctx2.font = "bold 30px Arial";
	ctx2.fillStyle = "white";
	ctx2.fillText("lives", 0, 40);
	
	ctx2.shadowBlur = 0;
}

var paddle = new Image();
	paddle.src = "../Resources/paddle.png"; 

var paddleHeight = 10;
var paddleWidth = 150;
var paddlePiece = paddleWidth / 4;
var paddleX = (canvas.width - paddleWidth) / 2;    //Function and variables to drawn the paddle
var paddleY = canvas.height - paddleHeight*3;

var rightPressed = false;
var leftPressed = false;

function drawPaddle() {
	ctx.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
}

var ball = new Image();
	ball.src = "../Resources/ball3.png";

var x = canvas.width / 2;
var y = canvas.height - 40;
var tempY = -1;
var dx = 5;
var dy = -5;
var speed = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  //function and variables for drawing the ball
var ballRadius = 10;
var launched = false;

function drawBall() {
	ctx.drawImage(ball, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
}

var brickRowCount = 3;
var brickColumnCount = 10;
var brickPadding = 2;
var brickOffsetTop = 80;
var brickOffsetLeft = 80;

var colorRow1 = "blue";
var colorRow2 = "yellow";
var colorRow3 = "red";    

var randomStatus;         //function and variables for creating the blocks
			
var bricks = [];
function brickArrayCreator(){
	if(bricks.length == 0){
		for(var c=0; c<brickColumnCount; c++) {
			bricks[c] = [];
			for(var r=0; r<brickRowCount; r++) {
				
				switch (level){
					case 1:
						brickRowCount = 3;
						
						bricks[c][r] = { x: 0, y: 0, status: 0 };
						break;
						
					case 2:
						brickRowCount = 4;
						
						min = Math.ceil(0);
						max = Math.floor(2);
					
						randomStatus = Math.floor(Math.random() * (max - min + 1)) + min;
						
						bricks[c][r] = { x: 0, y: 0, status: randomStatus };
						break;
						
					case 3:
						brickRowCount = 6;
						
						min = Math.ceil(-1);
						max = Math.floor(3);
					
						randomStatus = Math.floor(Math.random() * (max - min + 1)) + min;
						
						bricks[c][r] = { x: 0, y: 0, status: randomStatus };
						break;
				}
				
				if(bricks[c][r].status != -1){
					maxScore = maxScore + 10;
				}
			}
		}
	}
}


var imgbricks = new Image();
	imgbricks.src = "../Resources/sprite_bricks_+special.png"; 
	
var bricksWidth = 902;
var bricksHeight = 32;
var bricksRatio = 0.5;
var bricksFrames = 11;
var brickFrame = 0;
var brickPicked = (bricksWidth/bricksFrames)

var brickStyle;

function drawBricks() {
	for(var c=0; c<brickColumnCount; c++) {                //function to draw the blocks
		for(var r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status > -1) {
				var brickX =(c*(bricksWidth/bricksFrames+brickPadding))+brickOffsetLeft;
				var brickY =(r*(bricksHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;

				brickStyle = bricks[c][r].status;

				switch (brickStyle)
				{
				case 0:
					brickFrame = 0;
					break;
					
				case 1:
					brickFrame = 1;
					break;
					
				case 2:
					brickFrame = 2;
					break;
				
				case 3:
					brickFrame = 10;
					break;
				} 
				
				ctx.drawImage(imgbricks, brickPicked * brickFrame, 0, brickPicked, bricksHeight, bricks[c][r].x, bricks[c][r].y, bricksWidth/bricksFrames, bricksHeight);
			}
		}
	}
}

var specialEffect = 0;
var hit = false;

function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {			//function that manages the hit detection of the blocks
			var b = bricks[c][r];
			
			if(b.status > -1) {
					
				if(x + ballRadius > b.x && x - ballRadius < b.x+bricksWidth/bricksFrames && 
				y > b.y && y < b.y+bricksHeight){
					dx = -dx;
					hit = true;
				}
				
				if(x > b.x && x < b.x+bricksWidth/bricksFrames && 
				y + ballRadius > b.y && y - ballRadius < b.y+bricksHeight){
					dy = -dy;
					hit = true;
				}
				
				if(hit == true){
					if(b.status > -1 && b.status != 3){
						b.status = b.status - 1;
						hit = false;
					}
					
					if(b.status == 3){
						b.status = -1;
						hit = false;
						
						min = Math.ceil(1);
						max = Math.floor(2);
					
						specialEffect = Math.floor(Math.random() * (max - min + 1)) + min;
					}
					
					if(b.status == -1){
						score = score + 10;
						scoreCounter = scoreCounter + 10;
					}
					
					if(score == maxScore) {
						level++;
						launched = false;
						win = true;
						btnWinEnabled = true;
						drawWinScreen();
					}
				}
			}
		}
	}
}

var specialEffectCounter = 0;

function specialEffects(){
	
	specialEffectCounter++;
	
	if(specialEffectCounter > 500){
		specialEffectCounter = 0;
		specialEffect = 0;
	}
	
	switch(specialEffect){
		case 0:
			if(paddleWidth > 150 && paused == false && launched == true){
				paddleWidth = paddleWidth - 0.1;
			}
			
			if(paddleWidth < 150 && paused == false && launched == true){
				paddleWidth = paddleWidth + 0.1;
			}
			
			break;
		case 1:
			paddleWidth = paddleWidth * 2;
			specialEffectCounter = 0;
			specialEffect = 0;
			break;	
			
		case 2:
			paddleWidth = paddleWidth/2;
			specialEffectCounter = 0;
			specialEffect = 0;
			break;	
	}
	
}

var backgroundLevel1 = new Image();
	backgroundLevel1.src = "../Resources/bg_level1.png";

var backgroundLevel2 = new Image();
	backgroundLevel2.src = "../Resources/bg_level2.png";

var backgroundLevel3 = new Image();
	backgroundLevel3.src = "../Resources/bg_level3.png";


var distance;
var force;
var topBounce = false;
var ballRandom;
var levelBackground;

function draw() {
	if(lost == false && win == false){
		
		switch(level){
			case 1:
				levelBackground = backgroundLevel1;
				break;
				
			case 2:
				levelBackground = backgroundLevel2;
				break;	
				
			case 3:
				levelBackground = backgroundLevel3;
				break;	
				
			case 4:
				document.location.reload();
				break;
		}
		
		ctx.drawImage(levelBackground, 0, 0, canvas.width, canvas.height);
		
		brickArrayCreator();
		drawBall();
		drawPaddle();
		drawBricks();
		collisionDetection();
		specialEffects();
		drawScore();
		drawLives();
		
		if(x + dx > canvas.width - ballRadius - canvasBorderOffSet || x + dx < ballRadius + canvasBorderOffSet) {
			dx = -dx;
		}
														//function that draws the game itself and
		if(y + dy < ballRadius + canvasBorderOffSet - 5) {	//manages the hit detection of the ball with the walls and paddle
			dy = -dy;
		} else if(y + dy > canvas.height - canvasBorderOffSet + 5) {
				
			lives--;
			lifeFrame++;
			launched = false;
			
			if(lives < 1){			//game over when lives < 1
				lost = true;
				btnLoseEnabled = true;
			}
			else {
				
				min = Math.ceil(-5);
				max = Math.floor(5);
			
				ballRandom = Math.floor(Math.random() * (max - min + 1)) + min;
				
				dx = ballRandom;	 	//resets the game when loosing a life
				
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
		
		if(x - ballRadius/2 > paddleX && x + ballRadius/2 < paddleX + paddleWidth && y + dy > paddleY - ballRadius) {
			topBounce = true;
			distance = x - paddleX - paddleWidth/2;		//force and direction of the ball depending on distance from the middle of paddle
			force = ((distance * 100)/paddleWidth/2)/5;
			dy = -dy;
			dx = force;
		}
		
		if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth && 		//collision for the sides of the paddle
		y > paddleY && y < paddleY + paddleHeight && topBounce == false){
			dy = -dy;
			dx = dx * -1;
		}
		
		if(x > paddleX && x < paddleX + paddleWidth && 
		y + ballRadius > paddleY && y - ballRadius < paddleY + paddleHeight && topBounce == false){
			dy = -dy;
			dx = Math.sqrt(Math.pow(dx, 2));
			
		}
		
		topBounce = false;
		
			if(paused == false){
				if(rightPressed && paddleX < canvas.width - paddleWidth - canvasBorderOffSet) {
					paddleX += 7;
				}												//manages the movement of the paddle with the arrow keys
				else if(leftPressed && paddleX > 0 + canvasBorderOffSet) {
					paddleX -= 7;
				}
				
				if(paddleX > canvas.width - paddleWidth - canvasBorderOffSet) {
					paddleX = canvas.width - paddleWidth - canvasBorderOffSet;
				}												
				else if(paddleX < 0 + canvasBorderOffSet) {
					paddleX = 0 + canvasBorderOffSet;
				}
				
			}
			
			
			tempDY = Math.sign(dy);

			if(speed != Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))){
				dy = -(Math.sqrt(Math.pow(speed, 2) - (Math.pow(dx, 2))));		//forces the ball to maintain a constant speed
			}
			
			speed = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			
			if(launched == false){
				x = paddleX + paddleWidth/2;
				y = paddleY - paddleHeight*1.5;
				
			}
			
			if(launched == true){
				if(paused == false){
					x += dx;
					y += dy;
				}
				else{
					ctx.globalAlpha = 0.95;
					ctx.beginPath();
					ctx.rect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = "black";
					ctx.fill();
					ctx.closePath();
					ctx.globalAlpha = 1;
					
					ctx.beginPath();
					ctx.rect(canvas.width/2 - 75, canvas.height/4, 50, 200);  //pause menu draw
					ctx.fillStyle = "white";
					ctx.fill();
					ctx.closePath();
					
					ctx.beginPath();
					ctx.rect(canvas.width/2 + 25, canvas.height/4, 50, 200);
					ctx.fillStyle = "white";
					ctx.fill();
					ctx.closePath();
					
				}
			}
			
			requestAnimationFrame(draw);
	}
	else{
		drawLoseScreen();
	}
}


document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}								//function that detects when a key is pressed
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}


document.addEventListener("keyup", keyUpHandler, false); 

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;		//function that detects when a key is unpressed
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
	
	if(e.keyCode == 32){
		
		
		if(launched == false){
			launched = true;
		}
		else{
			if(paused == false){
				paused = true;
			}
			else{
				paused = false;
			}
		}
	}
}


document.addEventListener("mousemove", mouseMoveHandler, false);
	
function mouseMoveHandler(e) {
	relativeX = e.clientX - canvas.getBoundingClientRect().left;
	relativeY = e.clientY - canvas.getBoundingClientRect().top;		//functions that moves the paddle with mouse
	
	if(paused == false){
		if(paddleX >= 0 + canvasBorderOffSet && paddleX <= canvas.width - paddleWidth - canvasBorderOffSet) {
			paddleX = relativeX - paddleWidth/2;
		}
		
		if(paddleX < 0 + canvasBorderOffSet){
			paddleX = 0 + canvasBorderOffSet;
		}
		
		if(paddleX > canvas.width - paddleWidth - canvasBorderOffSet){
			paddleX = canvas.width - paddleWidth - canvasBorderOffSet;
		}
	}
	
}


var btnStart = new Image();
	btnStart.src = "../Resources/btnStart.png";

var backgroundStart = new Image();
	backgroundStart.src = "../Resources/splashscreen_1100_720.png";

var btnStartWidth = 444;
var btnStartHeight = 104;
var btnStartX = (canvas.width-btnStartWidth)/2;
var btnStartY = canvas.height/1.4;
var btnStartEnabled = true;
var btnStartRatio = 1;					//function and variables for the starting screen
var offSetX = 0;
var offSetY = 0;
var Random = 0;
var vibrate = true;

var canvasDiv = document.getElementById('animated1');
var canvasDivYvalue = -525;

var startingPause = setInterval(function(){	
	
	canvasDivYvalue = canvasDivYvalue + 10;
	
	canvasDiv.style.top = canvasDivYvalue + "px";
	
	ctx.drawImage(backgroundStart, 0, 0, canvas.width, canvas.height);	//animates the canvas at the beginning 
	
	if(canvasDivYvalue >= 20){
		clearInterval(startingPause)
		Start();
	}
}, 30);	

function Start(){
	var shakyButton = setInterval(function(){
		
		if(vibrate == true){
			Random = Random + 1;
			if(Random == 5){			//makes the button shake
				Random = 0;
			}
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		if(relativeX > btnStartX && relativeX < btnStartX + btnStartWidth &&
		relativeY > btnStartY && relativeY < btnStartY + btnStartHeight && btnStartEnabled == true ){
			btnStartRatio = 1.1;
			offSetX = -25;			//makes the button bigger when mouse over and stops the shake momentarily
			offSetY = -5;
			vibrate = false;
		}
		else{
			vibrate = true;
		}
		
		switch (Random){
			case 0:
				offSetX = -20;
				offSetY = -5;
				break;
			case 1:
				offSetX = -25;
				offSetY = -5;
				break;
			case 2:
				offSetX = -15;
				offSetY = -5;
				break;
			case 3:
				offSetX = -20;
				offSetY = -10;
				break;	
			case 4:
				offSetX = -20;
				offSetY = -0;
				break;	
		}
		
		ctx.drawImage(backgroundStart, 0, 0, canvas.width, canvas.height);
		
		ctx.drawImage(btnStart, btnStartX + offSetX, btnStartY + offSetY, btnStartWidth * btnStartRatio, btnStartHeight * btnStartRatio);

		btnStartRatio = 1;
		offSetX = 0;
		offSetY = 0;
		if(btnStartEnabled == false){
			clearInterval(shakyButton);
		}
	}, 50);	
}

canvas.addEventListener("click",function(e){
	
		if(relativeX > btnStartX && relativeX < btnStartX + btnStartWidth &&
		relativeY > btnStartY && relativeY < btnStartY + btnStartHeight && btnStartEnabled == true ){
			
			btnStartEnabled = false;		//function that detects when the start button is clicked
			
			var loadingTimer = setInterval(function(){
				loadingMessageNumber++;
				loadingBlockNumber++;
				if (loadingMessageNumber == 4){
					loadingMessageNumber = 0;
				}
				
				if (loadingBlockNumber == 9){
					loadingBlockNumber = 0;
					clearInterval(loadingTimer);
					draw();
				}
				else{
					requestAnimationFrame(drawLoadingScreen);
				}
			}, 500);
		}
		
		if(relativeX > btnLoseX - LoseshrinkingOffSetLeft && relativeX < btnLoseX - LoseshrinkingOffSetLeft + btnLoseWidth * btnLoseRatio &&
		relativeY > btnLoseY - LoseshrinkingOffSetTop && relativeY < btnLoseY - LoseshrinkingOffSetTop + btnLoseHeight * btnLoseRatio && btnLoseEnabled == true ){
			btnLoseEnabled = false;							//function that detects when the lose button is clicked
			lost = false;
			launched = false;
		}
		
		
		if(relativeX > btnWinX - WinshrinkingOffSetLeft && relativeX < btnWinX - WinshrinkingOffSetLeft + btnWinWidth * btnWinRatio &&
		relativeY > btnWinY - WinshrinkingOffSetTop && relativeY < btnWinY - WinshrinkingOffSetTop + btnWinHeight * btnWinRatio && btnWinEnabled == true ){
			btnWinEnabled = false;							//function that detects when the win button is clicked
			win = false;
			launched = false;
		}
		
});

var loadingWidth = 200;
var loadingHeight = 30;

var loadingBlockWidth = loadingWidth/10;
var loadingBlockHeight = loadingHeight/1.5;
var loadingBlockOffSetLeft = 7;
var loadingBlockOffSetTop = 8;
var loadingBlockNumber = -2;

var backgroundLoading = new Image();
	backgroundLoading.src = "../Resources/loading.png";
	
var loadingRatio = 1.5;

var loadingMessageNumber = -1;

function drawLoadingScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(backgroundLoading, 0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "black";
	
	ctx.beginPath();
	ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2, canvas.height/2 - loadingHeight*loadingRatio/2, loadingWidth*loadingRatio, loadingHeight*loadingRatio);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 10;
	ctx.stroke();
	ctx.closePath();
	
	switch (loadingMessageNumber){
		case 0:
			ctx.font = "bold 30px Arial";
			ctx.fillText("LOADING", canvas.width/2 - loadingWidth*loadingRatio/4, canvas.height/2 + loadingHeight*loadingRatio*1.4);
			break;
			
		case 1:
			ctx.font = "bold 30px Arial";
			ctx.fillText("LOADING.", canvas.width/2 - loadingWidth*loadingRatio/4, canvas.height/2 + loadingHeight*loadingRatio*1.4);
			break;
																																			//switch function for the loading dots
		case 2:
			ctx.font = "bold 30px Arial";
			ctx.fillText("LOADING..", canvas.width/2 - loadingWidth*loadingRatio/4, canvas.height/2 + loadingHeight*loadingRatio*1.4);
			break;
			
		case 3:
			ctx.font = "bold 30px Arial";
			ctx.fillText("LOADING...", canvas.width/2 - loadingWidth*loadingRatio/4, canvas.height/2 + loadingHeight*loadingRatio*1.4);
			break;	
	}
	
	
	switch (loadingBlockNumber){					//horrible switch function for the loading blocks :,>
		case 0:									//which i could have probably made much smaller using a similar function like the one
			ctx.beginPath();				//that draws the bricks, but, since it works, there is no need to change it
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			break;
			
		case 1:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			break;
		
		case 2:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			break;
			
		case 3:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			break;
			
		case 4:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*4, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			break;	
			
		case 5:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*4, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*5, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			break;	

		case 6:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*4, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*5, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*6, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			break;		
			
		case 7:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*4, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*5, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*6, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*7, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			break;		
			
		case 8:
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*0, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*1, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*2, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*3, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*4, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();	
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*5, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*6, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*7, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(canvas.width/2 - loadingWidth*loadingRatio/2 + loadingBlockOffSetLeft + (loadingBlockOffSetLeft * 1.7 + loadingBlockWidth)*8, canvas.height/2 - loadingHeight*loadingRatio/2 + loadingBlockOffSetTop, loadingBlockWidth*loadingRatio, loadingBlockHeight*loadingRatio);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			break;		
	}
} 

var backgroundLose = new Image();
	backgroundLose.src = "../Resources/bg_level1.png";

var eyes = new Image();
	eyes.src = "../Resources/redeyes.png";
	
var eyesWidth = 774;
var eyesHeight = 294;
var eyesRatio = 0.6;
var eyesRotation = 5;

var hehehe = new Image();
	hehehe.src = "../Resources/laugh.png";
	
var heheheWidth = 1036;
var heheheHeight = 665;
var heheheRatio = 0.3;
var heheheRotation = 15;

var txtLost = "GAME OVER";
var txtNewGame = "Play again?";

var btnLoseX = canvas.width/2.6;
var btnLoseY = canvas.height/1.25;
var btnLoseWidth = 235;
var btnLoseHeight = 50;
var btnLoseRatio = 1;
var btnLoseThickness = 3;
var btnLoseBlur = 20;
var btnLoseEnabled = false;

var shrinking = false;
var LoseshrinkingOffSetLeft = 0;
var LoseshrinkingOffSetTop = 0;

function drawLoseScreen() {
	if(lost == true){
		
		drawScore();
		drawLives();
		
		ctx.globalAlpha = 1;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(backgroundLose, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "black";
		
		ctx.shadowColor = 'red';
		ctx.shadowBlur = 100;
		
		ctx.globalAlpha = 0.8;
		ctx.rotate(-eyesRotation*Math.PI/180);
		
		ctx.drawImage(eyes, canvas.width/2.2 - eyesWidth*eyesRatio/2, canvas.height/1.5 - eyesHeight * eyesRatio, eyesWidth * eyesRatio, eyesHeight * eyesRatio);
		
		ctx.rotate(eyesRotation*Math.PI/180);
		ctx.globalAlpha = 1;
		
		ctx.rotate(-heheheRotation*Math.PI/180);
		
		ctx.drawImage(hehehe, canvas.width/1.5 - heheheWidth*heheheRatio/2, canvas.height/1.5 - heheheHeight * heheheRatio/4, heheheWidth * heheheRatio, heheheHeight * heheheRatio);
		
		ctx.rotate(heheheRotation*Math.PI/180);
		
		for (let i = 0; i < 4; i++) {
			ctx.font = "bold 80px Arial";
			ctx.shadowBlur = 50;
			ctx.fillText(txtLost, canvas.width/2 - ctx.measureText(txtLost).width/2, canvas.height/1.5);
		}
		
		ctx.shadowBlur = 0;
	
		ctx.beginPath();
		ctx.shadowColor = 'red';
		ctx.shadowBlur = btnLoseBlur;
		ctx.rect(btnLoseX - LoseshrinkingOffSetLeft, btnLoseY - LoseshrinkingOffSetTop, btnLoseWidth * btnLoseRatio, btnLoseHeight * btnLoseRatio);
		ctx.strokeStyle = "black";
		ctx.lineWidth = btnLoseThickness;
		ctx.stroke();
		ctx.closePath();
		
		
		ctx.font = "bold 40px Arial";
		ctx.fillText(txtNewGame, canvas.width/2 - ctx.measureText(txtNextLevel).width/2, canvas.height/1.15);
		
		
		if(btnLoseRatio < 1.3 && shrinking == false){
			btnLoseRatio = btnLoseRatio + 0.01;
			LoseshrinkingOffSetLeft = LoseshrinkingOffSetLeft + 1;
			LoseshrinkingOffSetTop = LoseshrinkingOffSetTop + 0.25;
			btnLoseThickness = btnLoseThickness + 0.1;
			btnLoseBlur = btnLoseBlur - 0.5;
		}
		else if(btnLoseRatio > 1){
			shrinking = true;
			btnLoseRatio = btnLoseRatio - 0.01;
			LoseshrinkingOffSetLeft = LoseshrinkingOffSetLeft - 1;
			LoseshrinkingOffSetTop = LoseshrinkingOffSetTop - 0.25;
			btnLoseThickness = btnLoseThickness - 0.1;
			btnLoseBlur = btnLoseBlur + 0.5;
		}
		else{
			shrinking = false;
		}
		
		flashing = false;
		lifeBlur = 0;
		ctx.shadowBlur = 0;
		bricks.length = 0;
		level = 1;
		score = 0;
		maxScore = 0;
		lives = 3;
		lifeFrame = 3;
		x = canvas.width/2;
		y = canvas.height-40;		//resets the variables for the new game
		dx = 5;
		dy = -5;
		
		requestAnimationFrame(drawLoseScreen);
	}
	else{
		lifeFrame = 0;
		draw();
	}
}


var backgroundWin = new Image();
	backgroundWin.src = "../Resources/bg_level1.png";

var fireWorks = new Image();
	fireWorks.src = "../Resources/success.png";

var fireWorksWidth = 8000; 
var fireWorksHeight = 5363;
var fireWorksRatio = 15;
var fireWorksRotation = 0;
var fireWorksOffSet = 0;

var txtSuccess = "SUCCESS!";
var txtNextLevel = "Next level?";

var btnWinX = canvas.width/2.6;
var btnWinY = canvas.height/1.25;
var btnWinWidth = 235;
var btnWinHeight = 50;
var btnWinText
var btnWinRatio = 1;
var btnWinThickness = 3;
var btnWinBlur = 20;
var btnWinEnabled = false;

var fade = 1;

var WinshrinkingOffSetLeft = 0;
var WinshrinkingOffSetTop = 0;


function drawWinScreen() {
	if(win == true){
		
		drawScore();
		drawLives();
		
		ctx.globalAlpha = 1;
		
		ctx.drawImage(backgroundWin, 0, 0, canvas.width, canvas.height);
		
		if(fade > 0){
			fade = fade - 0.01;
			ctx.globalAlpha = fade;
		}
		else{
			min = Math.ceil(-30);
			max = Math.floor(30);
			
			fireWorksRotation = Math.floor(Math.random() * (max - min + 1)) + min;
			
			min = Math.ceil(-100);
			max = Math.floor(100);
			
			fireWorksOffSet = Math.floor(Math.random() * (max - min + 1)) + min;
			
			if(Math.sign(fireWorksOffSet) < 1){
				fireWorksRotation = fireWorksRotation * -1;
			}
			
			fade = 1;
			ctx.globalAlpha = fade;
		}
		ctx.translate(canvas.width/2 + fireWorksOffSet, canvas.height/1.2);
		ctx.rotate(fireWorksRotation*Math.PI/180);
		
		ctx.drawImage(fireWorks, -(fireWorksWidth/fireWorksRatio/2), -(fireWorksHeight/fireWorksRatio), fireWorksWidth/fireWorksRatio, fireWorksHeight/fireWorksRatio);
		
		ctx.rotate(-fireWorksRotation*Math.PI/180);
		ctx.translate(-(canvas.width/2 + fireWorksOffSet), -(canvas.height/1.2));
		
		
		
		ctx.globalAlpha = 1;
		
		for (let i = 0; i < 4; i++) {
			ctx.font = "bold 80px Arial";
			ctx.shadowColor = 'white';
			ctx.shadowBlur = 50;
			ctx.fillStyle = "yellow";
			ctx.fillText(txtSuccess, canvas.width/2 - ctx.measureText(txtSuccess).width/2, canvas.height/1.5);
		}
	
		ctx.beginPath();
		ctx.shadowColor = 'white';
		ctx.shadowBlur = btnWinBlur;
		ctx.rect(btnWinX - WinshrinkingOffSetLeft, btnWinY - WinshrinkingOffSetTop, btnWinWidth * btnWinRatio, btnWinHeight * btnWinRatio);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = btnWinThickness;
		ctx.stroke();
		ctx.closePath();
		
		
		ctx.font = "bold 40px Arial";
		ctx.fillText(txtNextLevel, canvas.width/2 - ctx.measureText(txtNextLevel).width/2, canvas.height/1.15);
		
		if(btnWinRatio < 1.3 && shrinking == false){
			btnWinRatio = btnWinRatio + 0.01;
			WinshrinkingOffSetLeft = WinshrinkingOffSetLeft + 1;
			WinshrinkingOffSetTop = WinshrinkingOffSetTop + 0.25;
			btnWinThickness = btnWinThickness + 0.1;
			btnWinBlur = btnWinBlur - 0.5;
		}
		else if(btnWinRatio > 1){
			shrinking = true;
			btnWinRatio = btnWinRatio - 0.01;
			WinshrinkingOffSetLeft = WinshrinkingOffSetLeft - 1;
			WinshrinkingOffSetTop = WinshrinkingOffSetTop - 0.25;
			btnWinThickness = btnWinThickness - 0.1;
			btnWinBlur = btnWinBlur + 0.5;
		}
		else{
			shrinking = false;
		}
		flashing = false;
		lifeBlur = 0;
		ctx.shadowBlur = 0;
		bricks.length = 0;
		x = canvas.width/2;
		y = canvas.height-40;		//resets the variables for the new game
		dx = 5;
		dy = -5;
		
		requestAnimationFrame(drawWinScreen);
	}
	else{
		draw();
	}
}
