var BOX_SIZE = 10;
var SNAKE_COLOR = '#fff';
var BUG_COLOR = '#C6FF9B';
var height = 450;
var width = 600;
var ctx;
var canvas;
var point = 0;

function Box(initialX, initialY) {

  this.iniX = initialX;
  this.iniY = initialY;

  this.width = BOX_SIZE;
  this.height = BOX_SIZE;
};

//Draw rectanle on canvas	
Box.prototype.redraw = function() {
  ctx.fillRect(this.iniX, this.iniY, this.width, this.height);
};

Box.prototype.checkPos = function(x_pos, y_pos) {
  return (this.iniX == x_pos && this.iniY == y_pos)
};



function Snake() {

  var box1 = new Box(160, 40);
  var box2 = new Box(150, 40);
  var box3 = new Box(140, 40);
  var box4 = new Box(130, 40);
  var box5 = new Box(130, 40);

  this.firstBox = box1;
  this.body = [box1, box2, box3, box4];

  this.orientation = "right";
  this.point = 0;
  this.pointBox = document.getElementById('point');
  this.canvas = $("#myBoard");
};

Snake.prototype.move = function() {
  var last = this.body.pop();
  this.previous = new Box(last.iniX, last.iniY);
  switch (this.orientation) {
    case "left":
      last.iniX = this.firstBox.iniX - BOX_SIZE;
      last.iniY = this.firstBox.iniY
      break;

    case "right":
      last.iniX = this.firstBox.iniX + BOX_SIZE;
      last.iniY = this.firstBox.iniY
      break;

    case "top":
      last.iniY = this.firstBox.iniY - BOX_SIZE;
      last.iniX = this.firstBox.iniX
      break;

    case "bottom":
      last.iniY = this.firstBox.iniY + BOX_SIZE;
      last.iniX = this.firstBox.iniX
      break;
    default:
      connsole.log("ERROR ORIENTATION");

  }
  this.firstBox = last;
  this.body.unshift(last);
};

Snake.prototype.draw = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = SNAKE_COLOR
  
  for (var i = 0; i < this.body.length; i++) {
    this.body[i].redraw();
  }
};

Snake.prototype.check = function() {


  if (this.firstBox.iniX < 0 || this.firstBox.iniY < 0 || this.firstBox.iniX > width || this.firstBox.iniY > height) {
    return false;
  } /*else if (!this.checkValidNewBugPos(this.firstBox.iniX, this.firstBox.iniY, 1)) {
    return false;
  }*/
  return true;
};

Snake.prototype.changeOrientation = function(direction) {
  switch (direction) {
    case "up":
      if (this.orientation == "right" || this.orientation == "left") {
        this.orientation = "top";
      };
      break;

    case "down":
      if (this.orientation == "right" || this.orientation == "left") {
        this.orientation = "bottom";
      };
      break

    case "left":
      if (this.orientation == "top" || this.orientation == "bottom") {
        this.orientation = "left";
      };
      break;

    case "right":
      if (this.orientation == "top" || this.orientation == "bottom") {
        this.orientation = "right";
      };
      break;

    default:
      //console.log("DIRECTION ERROR");
      //console.log(direction);
  }
};

Snake.prototype.eaten = function(bug) {
  if (this.firstBox.iniX == bug.iniX && this.firstBox.iniY == bug.iniY) {
  	this.successEat();
    var box = new Box(bug.iniX, bug.iniY);
    this.body.push(box);
    return true;
  } else {
    return false;
  }
}

Snake.prototype.checkValidNewBugPos = function(x_pos, y_pos, initial) {

  for (var i = initial; i < this.body.length; i++) {
    //console.log("####### (x_pos, y_pos) = (" +x_pos +" , " + y_pos +" ) ");
    if (this.body[i].checkPos(x_pos, y_pos)) {
      //console.log("The point is in snake");
      //console.log("############ END ##########");

      return false;
    }

    //console.log("The point is not in snake");
    //console.log("############ END ##########");
  };

  return true;
};


Snake.prototype.successEat = function(){
	this.point += 1;
  	this.pointBox.innerHTML = "Point : " + this.point;
  	this.canvas.removeClass('blink');
  	this.canvas.addClass('blink');
}


function Bug() {

  this.iniX = 0;
  this.iniY = 0;

  this.width = BOX_SIZE;
  this.height = BOX_SIZE;
};

//Draw rectanle on canvas
Bug.prototype.redraw = function() {

  var centreX = this.iniX + this.width / 2;
  var centreY = this.iniY + this.height / 2;

  ctx.beginPath();
  ctx.arc(centreX, centreY, BOX_SIZE / 2, 0, 2 * Math.PI);
  ctx.fillStyle = BUG_COLOR;
  ctx.fill();

};

Bug.prototype.rand_pos = function(snake) {

  var x = Math.floor(Math.random() * (width - 30));
  var y = Math.floor(Math.random() * (height - 30));

  x = x - x % 10;
  y = y - y % 10;

  while (!(snake.checkValidNewBugPos(x, y, 0))) {
    x = Math.floor(Math.random() * (width - 30));
    y = Math.floor(Math.random() * (height - 30));

    x = x - x % 10;
    y = y - y % 10;
  }

  this.iniX = x - x % 10;
  this.iniY = y - y % 10;

};



function PrefixedEvent(element, type, callback) {
	var pfx = ["webkit", "moz", "MS", "o", ""];
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

function blinkListener(e){
	e.target.className = '';
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
    	if(x % 2 === 0){
       		callback();
    	}else{
    		ctx.clearRect(0, 0, canvas.width, canvas.height);
    	}

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}


$(function() {
  PrefixedEvent(document.getElementById('myBoard'), "AnimationEnd", blinkListener);
  canvas = document.getElementById("myBoard");
  ctx = canvas.getContext("2d");

  var gameSnake = new Snake();
  var bug = new Bug();

  bug.rand_pos(gameSnake);

  gameSnake.draw();
  bug.redraw();

  //KEY press event
  document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) {
      gameSnake.changeOrientation("left");
    } else if (event.keyCode == 38) {
      gameSnake.changeOrientation("up");
    } else if (event.keyCode == 39) {
      gameSnake.changeOrientation("right");
    } else if (event.keyCode == 40) {
      gameSnake.changeOrientation("down");
    } else {
      //FOR NOW DO NOTHING
    }
  });


  helperTime = function() {
    gameSnake.move();
    if (gameSnake.check()) {
       gameSnake.draw();
       setTimeout(time, 100);
    }else{
    	gameSnake.body.shift();
    	gameSnake.body.push(gameSnake.previous);
    	$(".end-container h1").html("THE END ( "+ gameSnake.point +" points )");
    	$(".end-container").toggleClass('hide');
    	setIntervalX(function(){
    		$(".end-container").toggleClass('hide');
    		gameSnake.draw();
    	}, 100, 11);
    }


    bug.redraw();

    if (gameSnake.eaten(bug)) {
      //console.log("******THE BUG IS EATEN**********");
      bug.rand_pos(gameSnake);
    }
  }

  time = function() {
    helperTime();
  }




  //setTimeout(time, 100);

  $(".board-container").on('click', '.start-button', function(){
  	setTimeout(time, 1000);
  	$("#myBoard").removeClass('scale-out');
  	$(".instruction-container").addClass('scale-out');
  })


});
