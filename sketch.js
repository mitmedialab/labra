let font 
let word = "L A B R A C A D A B R A ";
let xOffset = 0;
let xOffsetBottom = 0;
let shiftDir = 1;
let bottomShiftDir = 1;
let animate = false;
let lastStartTime = 0;
let lastShiftTime = 0;
let intervalLong = 1500;
let intervalShort = 60; // 10 seconds interval
let blurAmount = 1;
let canvas;
let scl = 10;
let t = 0;
let blimpX, blimpY, blimpW, blimpH;
let ratX, ratY, ratW, ratH;
let foodcamX, foodcamY, foodcamW, foodcamH;
let cursorRat = false;
let foodcamColor = false;

let lastBlendTime = 0
let intervalBlend = 3200;
let blendTime = 450;
let blending = false;

function preload() {
	font = loadFont("Atlas Typewriter.otf")
	// chindoguTop = loadImage("img/chindogu-top.png")
	// chindoguBottom = loadImage("img/chindogu-bottom.png")
  clocky = loadImage("img/clocky.png");
  blimp = loadImage("img/blimp.png");

  rodent = loadImage("img/mouse.png");
  dog = loadImage("img/dog.png");

  foodcam = loadImage("img/foodcam2.png");
  foodcamGray = loadImage("img/foodcam2.png");

  blendie = loadImage("img/blendie.png");

  customCursor = loadImage('img/rat_cursor.png'); 
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight); 
  textFont(font)
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0);

  if (windowHeight > windowWidth * 2) {
    t = 3000;
  }

  // chindoguTop.filter(GRAY)
	// chindoguBottom.filter(GRAY)
  clocky.filter(GRAY);
  blimp.filter(GRAY);
  rodent.filter(GRAY);
  foodcamGray.filter(GRAY);
  dog.filter(GRAY);
  blendie.filter(GRAY);
  blendie.filter(BLUR, 1);

  tmp = Math.max(width, height)
  blimpW = 1.5*tmp/6;
  blimpH = 1.5*tmp/10;
  blimpX = width/2+30*scl;
  blimpY = height/2-4*scl;

  ratX = width-width/7-3*scl;
  ratY = height-width/7;
  ratW = width/7;
  ratH = width/7;

  
  foodcamW = width/6;
  foodcamH = 500*foodcamW/666;
  foodcamX = width-foodcamW-scl;
  foodcamY = scl;
  
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight); // Resize the canvas when the window is resized
  }

function keyPressed() {
	if(key == 'b' || key == 'B') {
		blurAmount += 1
		canvas.elt.style.filter = `blur(${blurAmount}px)`;
	}
	if(key == 'l' || key == 'L') {
		
		if (blurAmount > 1){
			blurAmount -= 1;
			canvas.elt.style.filter = `blur(${blurAmount}px)`;
		}
		
	}
}

function mousePressed() {
  if (mouseX > ratX && mouseX < ratX + ratW && mouseY > ratY && mouseY < ratY + ratH) {
    console.log("clicked");
    if (cursorRat) {
      cursor(ARROW);
    } else {
      cursor("img/rat_cursor.cur");
    }
    cursorRat = !cursorRat;
  }
}

function draw() {
  clear();
  t += 1;

  

  if (mouseX > blimpX && mouseX < blimpX + blimpW && mouseY > blimpY && mouseY < blimpY + blimpH) {
    // Move the image away from the mouse
    if (mouseX < blimpX + (blimpW/2)) {
      blimpX += 1; //random(1,3); // Move right
    } else {
      blimpX -= 1; //random(1,4); // Move left
    }
    
    if (mouseY < blimpY+ (blimpH/2)) {
      blimpY += 1; //random(1,4); // Move down
    } else {
      blimpY -= 1; //random(1,4); // Move up
    }
  }

  // Keep the image within the bounds of the canvas
  blimpX = constrain(blimpX, 0, width - blimpW);
  blimpY = constrain(blimpY, 0, height - blimpH);

  if (mouseX > foodcamX && mouseX < foodcamX + foodcamW && mouseY > foodcamY && mouseY < foodcamY + foodcamH) {
    image(foodcam, foodcamX, foodcamY, foodcamW, foodcamH);
  } else {
    image(foodcamGray, foodcamX, foodcamY, foodcamW, foodcamH);
  }

  // image(chindoguTop, 0, -scl*4, width/6, width/6);
  // image(chindoguBottom, 2*width/3+15*scl, 5*height/8, width/3, width/3);
  image(clocky, width/2+30*scl - t*0.02, t*0.05, width/5, width/6);
  image(rodent, ratX, ratY, ratW, ratH);
  image(dog, 7*width/10, height-150, 100, 150);
  

  if (millis() - lastBlendTime > intervalBlend + blendTime) {
    blending = false;
    lastBlendTime = millis();
    intervalBlend = random(1000, 3000);
  }

  if (millis() - lastBlendTime > intervalBlend) {
    image(blendie, width-100+ sin(10000*t)*4, height-560, 180, 360);
  } else {
    image(blendie, width-100, height-560, 180, 360);
  }
  


  
  
  

  let x = width / 2;
  let lineHeight = 42; // Spacing between lines
  let yStart = lineHeight;
  
  if (!animate && millis() - lastStartTime > intervalLong) {
    lastStartTime = millis();
    animate = true;
    
    shiftDir = random([-1, 1]);
    bottomShiftDir = random([-1, 1]);
    intervalLong = Math.pow(random(13, 64), 2);
    intervalShort = random(30, 90);
  }

  // Shift every 10 seconds
  if (animate && millis() - lastShiftTime > intervalShort) {
    xOffset += 2 * shiftDir; // Shift the letters by 1
    xOffsetBottom += 2 * bottomShiftDir;
    lastShiftTime = millis(); // Reset the timer
    lastStartTime = millis();
  }
  
  if (xOffset >= word.length || xOffset <= -word.length) {
    animate = false;
  }

  // If the shift exceeds the length of the word, reset it
  xOffset = xOffset % word.length;
  xOffsetBottom = xOffsetBottom % word.length;

  // top triangle
  for (let i = word.length; i > 6; i -= 2) {
    if (i == word.length) {
      fill(0, 0, 0);  
    } else {
      fill(69, 69, 69);  
    }

    let currentLine = word.substring(0, i);

    // Shift characters right by rearranging the letters
    let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);

    text(shiftedLine, x, yStart);
    if (i == 6) {
	  //text("M I T   ", x-340, yStart-lineHeight)
      text("M E D I A   ", x-340, yStart)
    }
    yStart += lineHeight; // Move down for the next line
  }

  // middle
  let currentLine = word.substring(0, 6);
  let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);
  text(shiftedLine, x, yStart);
  //text("M E D I A   ", x-340, yStart);
  yStart += lineHeight; // Move down for the next line

  // bottom triangle
  for (let i = 8; i <= word.length; i += 2) {
    if (i == word.length) {
      fill(0, 0, 0);  
    } else {
      fill(69, 69, 69);  
    }

    let currentLine = word.substring(0, i);

    // Shift characters right by rearranging the letters
    let shiftedLine = currentLine.slice(-xOffsetBottom) + currentLine.slice(0, -xOffsetBottom);

    text(shiftedLine, x, yStart);
    yStart += lineHeight; // Move down for the next line
  }

  image(blimp, blimpX, blimpY, blimpW, blimpH);
}
