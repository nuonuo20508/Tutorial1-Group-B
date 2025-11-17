let strokeOption;
let baseSize;
let scale;
let canvas = 800; // Basic canvas size
let bgColor = [247, 241, 219];

// Adjust stroke weights and scale based on current window size
function adjustStrokeAndScale() {

  baseSize = (windowWidth + windowHeight) / 2;
  // Calculate the scale relative to the basic canvas size
  scale = baseSize / canvas;
  // Base stroke weights for aesthetic line patterns
  strokeOption = [0.4, 0.8, 1, 2, 3.5];
  for (let i = 0; i < strokeOption.length; i++) {
    strokeOption[i] *= scale;
  }
}

// Draw a group of parallel lines with 30-degree
// // Draw a group of axial parallel lines
function drawLineGroup() {
  
  // Generate a certain proportion (40%) of lines that are the same color as the background
  const lineColor = random() < 0.6 ? 0 : bgColor
  
  // Randomly select the startpoint (x1, y1)
  // The origin is at the canvas center
  const x1 = random(-width / 2, width / 2);
  const y1 = random(-height / 2, height / 2);

  // Determine horizontal and vertical direction offsets
  // Using ternary operators
  const signX = random() > 0.5 ? 1 : -1;
  const signY = random() > 0.5 ? 1 : -1;
  // Decide if this group is tilted
  const isTilted = random() < 0.5;

  // Use scale to keep line lengths visually consistent across window sizes
  const lineLength = random(80,200) * scale;

  // Horizontal and vertical shift
  let hShift, vShift;

  if (isTilted) {
    // 30-degree tilt
    const angle = tan(30);
    hShift = lineLength * signX;
    vShift = lineLength * angle * signY;
  } 
  // Non-tilted
  else {
    if (random() < 0.5) { 
      // Horizontal line
      hShift = lineLength * signX;
      vShift = 0;
    } else {
      // Vertical line
      hShift = 0;
      vShift = lineLength * signY;
    }
  }

  // Line endpoint (x2, y2)
  const x2 = x1 + hShift;
  const y2 = y1 + vShift;
  // Randomly determine number of lines in the group and their spacing
  const numLines = floor(random(10, 30));
  const spacing = random(3, 8);

  // Use absolute value to determine the direction of a line
  const absH = abs(hShift);
  const absV = abs(vShift);

  // Draw each line with vertical offset
  for (let i = 0; i < numLines; i++) {
    const offset = i * spacing; // Relative offset for each line in the group
    strokeWeight(random(strokeOption)); // Stroke weight for each line
    
    // Set the color of the current line (which could be black or the bgColor)
    stroke(lineColor);

    let X1 = x1;
    let Y1 = y1;
    let X2 = x2;
    let Y2 = y2;

    // Offset each horizontal line along the y-axis
    if (absH > absV) {
      Y1 += offset;
      Y2 += offset;
    } 
    // Offset each vertical line along the x-axis
    else {
      X1 += offset;
      X2 += offset;
    }
    
    line(X1, Y1, X2, Y2);
  }
}

// Draw one main hidden line group across the entire canvas
function drawMainHiddenLines() {
  stroke(bgColor);

  const numLines = floor(random(5, 15));
  // Set line spacing to adapt proportionally to window
  const spacing = random(10, 20) * scale;
  // Tilt angle for the hidden line group
  const baseAngle = random(-45, 45);

  // Offset each line within the group
  for (let i = 0; i < numLines; i++) {
    // Evenly distribute each line along the x-axis with small random movement
    const offset = (i - numLines / 2) * spacing + random(-5, 5) * scale;
    
    // Keep the startpoints and endpoints along the top and bottom edges of the canvas
    const y1 = -height / 2;
    const y2 = height / 2;
    
    // Adjust the x-coordinate of startpoints and endpoints according to the tilt angle
    const shift = height * tan(baseAngle);
    const x1 = offset - shift ;
    const x2 = offset + shift ; 

    // Line stroke
    strokeWeight(random(strokeOption) * scale * 4);
    line(x1, y1, x2, y2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  adjustStrokeAndScale();
  noLoop();

  background(bgColor);
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2);

  // Draw 80 line groups
  const numGroups = 80;
  for (let g = 0; g < numGroups; g++) {
    drawLineGroup();
  }
  drawMainHiddenLines();
}

// Window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}