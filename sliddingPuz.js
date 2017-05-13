/*Taylor Brown*/

var timeLimit = -1;
var pic = 1;
var pieceWidth;
var pieceHeight;
var pieceSize;
var canvas;
var rect;
var distance=0;
var emptyLoc,coords;
var scaleX,scaleY;
var secondsPass=0;
var mins=0;
var seconds=0;
var intervalID;
var reset=-1;
var solved;

function setDif(num){
	switch(num){
		case 0:
		dif = 3;
		timeLimit = 360;
		break;
		case 1:
		dif = 4;
		timeLimit = 600;
		break; 
		case 2:
		dif = 5;
		timeLimit = 1000;
		break; 
		case 3:
		dif = 6;
		timeLimit = 1500;
		break; 
	}
}

function begin(num){
	$('#puzzle').css('display','inline');
	setDif(num);
	reset=0;
	timer(reset);
	img = new Image();
	img.addEventListener('load',image,false);
	img.src = "images/pic"+pic+".jpg";
}

function imageload(num){
	pic = num;
}

/*plays music*/
$(document).ready(function(){
	var sound = document.getElementById('music');
	var isPlaying = sound.currentTime > 0 && !sound.paused && !sound.ended && sound.readyState > 2;
	if (!isPlaying) {
		sound.play();
	}
});

/*Timer for the game*/
function timer(reset){
	if(intervalID){clearInterval(intervalID);}
	secondsPass=0;
	distance=0;
	intervalID = setInterval(function(){
		if(reset===0){
			secondsPass++;
			distance = timeLimit - secondsPass;
			mins = Math.floor(distance/60);
			seconds=distance-(mins*60);
			$('.clock').text(mins+":"+seconds);
			if(distance===0 && solved === false){
				reset=-1;
				gameOver();
			}
		}
	},1000);
};

function image(error){
	pieceWidth = Math.floor(img.width / dif);
	pieceHeight = Math.floor(img.height / dif);
	pieceSize = pieceWidth*pieceHeight;
	puzHeight = pieceHeight * dif;
	puzWidth = pieceWidth * dif;
	setCan();
	buildPuz();
	draw();
}

function setCan(){
	canvas = $('#puzzle').get(0);
	canvas.addEventListener('touchstart',move,false);
	canvas.addEventListener('click',move,false);
	stg = canvas.getContext('2d');
	canvas.width = puzWidth;
	canvas.height = puzHeight;
	canvas.style.border = "2px solid black";
}

/*in order*/
function buildPuz(){
	pieces = new Array(dif);
	for(var i = 0;i <dif; i++){
		pieces[i] = new Array(dif);
		for(var j = 0; j <dif; j++){
			pieces[i][j] = new Object;
			pieces[i][j].x = i;
			pieces[i][j].y = j;

		}
	}
	random();
	solved=false;

}

function random(){
	for(var i=dif-1; i>0;--i){
		for(var j = dif-1;j>0;--j){
			var v = Math.floor(Math.random()*(i+1));
			var tempj = pieces[i][j];
			var tempv = pieces[i][v];
			pieces[i][j]=tempv;
			pieces[i][v]=tempj;
		}
	}
	var randi = Math.floor(Math.random() *(dif));
	var randj = Math.floor(Math.random() *(dif));
	empty =new Object;
	empty.x = pieces[randi][randj].x;
	empty.y = pieces[randi][randj].y;
}

function draw(){
	stg.clearRect(0,0,puzWidth,puzHeight);
	for(var i =0; i <dif; ++i){
		for(var j = 0; j < dif; ++j){
			var x = pieces[i][j].x;
			var y = pieces[i][j].y;
			if(i != empty.x || j != empty.y || solved == true){
				stg.drawImage(img, x*pieceWidth,y*pieceHeight,pieceWidth,pieceHeight, i*pieceWidth,j*pieceHeight,pieceWidth,pieceHeight);
			}
		}
	}
}

function dist(){
	return Math.abs(coords.x-empty.x) + Math.abs(coords.y - empty.y);
}

function move(event){
	event.preventDefault();
	var touch;
	if(event.type == "touchstart"){
		touch = event.touches[0];
	}
	else{
		touch=event;
	}
	var rect = canvas.getBoundingClientRect();
	scaleX = canvas.width/ rect.width;
	scaleY = canvas.height/rect.height;
	touchX=Math.floor(((touch.clientX-rect.left)*scaleX)/pieceWidth);
	touchY=Math.floor(((touch.clientY-rect.top)*scaleY)/pieceHeight);
	coords = new Object;
	coords.x = touchX;
	coords.y = touchY;
	if(dist()==1){
		slide();
		draw();
	}
	if(solved){
		stg.clearRect(0,0,puzWidth,puzHeight);
			var img2 = new Image();
			reset=-1;
			img2.onload=function(){
				stg.drawImage(img2,0,0,img2.width,img2.height,0,0,canvas.width,canvas.height);
			};
			img2.src = "images/won.gif";
	}
}

function gameOver(){
	stg.clearRect(0,0,puzWidth,puzHeight);
	var img1 = new Image();
	img1.onload=function(){
		stg.drawImage(img1,0,0,img1.width,img1.height,0,0,canvas.width,canvas.height);
	};
	img1.src = "images/lost.png";
}

/*empty to coords */
function slide(){
	if(!solved){
		pieces[empty.x][empty.y].x = pieces[coords.x][coords.y].x;
		pieces[empty.x][empty.y].y = pieces[coords.x][coords.y].y;
		pieces[coords.x][coords.y].x = dif-1;
		pieces[coords.x][coords.y].y = dif-1;
		empty.x = coords.x;
		empty.y = coords.y;
		check();
	}
}

function check(){
	var f = true;
	for  (var i =0; i<dif; i++){
		for(var j=0; j<dif; j++){
			if((i != empty.x || j != empty.y) && (pieces[i][j].x != i || pieces[i][j].y != j)){
				f = false;
			}
		}
	}
	solved = f;
}