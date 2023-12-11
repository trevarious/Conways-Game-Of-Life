const speedSlider = document.getElementById('speedSlider');
const configSelector = document.getElementById('configSelector');
const placeConfigButton = document.getElementById('placeConfigButton');
const darkModeButton = document.getElementById('darkModeButton');
const body = document.body;
const section = document.querySelectorAll('section');

// Define the grid
const numRows = 30;
const numCols = 30;
const cellSize =20;

darkModeButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  section.forEach((sections) =>{
    sections.classList.toggle('dark-mode');
  })
});

// Initialize the grid
let grid = new Array(numRows).fill(null).map(() => new Array(numCols).fill(false));
let simulatedSpeed = speedSlider.value;
let lastUpdateTime = performance.now();
let frameRequestId = null;
let interval;

placeConfigButton.addEventListener('click', placeSelectedConfig);
speedSlider.addEventListener('input', function () {
simulatedSpeed = speedSlider.value;
})

// Create the grids
function createGrid() {
  const gridContainer = document.getElementById('grid');
  
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.addEventListener('click', () => toggleCell(row, col));
      gridContainer.appendChild(cell);
    }
  }
}
function placeSelectedConfig() {
  const selectedConfig = configSelector.value;
  
  switch (selectedConfig) {
      case 'glider':
          placeGlider();
          break;
      case 'spaceship':
          placeSpaceship();
          break;
      // Handle more configuration options here
  }
}
function placeGlider() {
  // Specify the top-left corner coordinates for placing the glider
  const row = 5;
  const col = 5;

  // Set the glider pattern cells on the grid
  grid[row + 1][col] = true;
  grid[row + 2][col + 1] = true;
  grid[row][col + 2] = true;
  grid[row + 1][col + 2] = true;
  grid[row + 2][col + 2] = true;

  // Update the cell display after placing the glider
  updateCellDisplay(row + 1, col);
  updateCellDisplay(row + 2, col + 1);
  updateCellDisplay(row, col + 2);
  updateCellDisplay(row + 1, col + 2);
  updateCellDisplay(row + 2, col + 2);
}

function placeSpaceship() {
  // Specify the top-left corner coordinates for placing the spaceship
  const row = 10;
  const col = 10;

  // Set the spaceship pattern cells on the grid
  grid[row][col + 1] = true;
  grid[row][col + 4] = true;
  grid[row + 1][col] = true;
  grid[row + 1][col + 4] = true;
  grid[row + 2][col + 3] = true;
  grid[row + 3][col] = true;
  grid[row + 3][col + 1] = true;
  grid[row + 3][col + 2] = true;
  grid[row + 3][col + 3] = true;

  // Update the cell display after placing the spaceship
  updateCellDisplay(row, col + 1);
  updateCellDisplay(row, col + 4);
  updateCellDisplay(row + 1, col);
  updateCellDisplay(row + 1, col + 4);
  updateCellDisplay(row + 2, col + 3);
  updateCellDisplay(row + 3, col);
  updateCellDisplay(row + 3, col + 1);
  updateCellDisplay(row + 3, col + 2);
  updateCellDisplay(row + 3, col + 3);
}






function toggleCell(row, col) {
  grid[row][col] = !grid[row][col];
  updateCellDisplay(row, col);
}

function updateCellDisplay(row, col) {
  const cell = document.getElementsByClassName('cell')[row * numCols + col];
  const aliveColor = document.getElementById('aliveColorPicker').value;
  const nextToDieColor = document.getElementById('nextToDieColorPicker').value;
  const showDeadCells = document.getElementById('showDeadCells').checked;

  if (grid[row][col]) {
      if (!willSurvive(row, col)) {
          cell.style.backgroundColor = nextToDieColor; // Cell will die on the next generation
      } else {
          cell.style.backgroundColor = aliveColor; // Cell will survive
      }
  } else {
      cell.style.backgroundColor = showDeadCells ? '#f0f0f0' : 'transparent'; // Show or hide dead cells
  }
}

const showDeadCellsCheckbox = document.getElementById('showDeadCells');
showDeadCellsCheckbox.addEventListener('change', () => {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            updateCellDisplay(row, col);
        }
    }
});




function updateGridAndDisplay() {
  const newGrid = new Array(numRows).fill(null).map(() => new Array(numCols).fill(false));

  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
          const neighbors = countNeighbors(row, col);
        
          if (grid[row][col]) {
              newGrid[row][col] = neighbors === 2 || neighbors === 3;
          } else {
              newGrid[row][col] = neighbors === 3;
          }
      }
  }

  grid = newGrid;

  // Update cell display after updating the grid
  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
          updateCellDisplay(row, col);
      }
  }
}


function countNeighbors(row, col) {
    let count = 0;
    const offsets = [-1, 0, 1];
  
    for (let i of offsets) {
      for (let j of offsets) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + numRows) % numRows; // Wrap row
        const newCol = (col + j + numCols) % numCols; // Wrap column
  
        if (grid[newRow][newCol]) {
          count++;
        }
      }
    }
  
    return count;
  }
  

function willSurvive(row, col) {
  const neighbors = countNeighbors(row, col);
  return (grid[row][col] && (neighbors === 2 || neighbors === 3)) || (!grid[row][col] && neighbors === 3);
}

function updateLoop(currentTime) {
  const deltaTime = currentTime - lastUpdateTime;

  // Calculate the time interval for the simulation based on simulatedSpeed
  const interval = 1000 / simulatedSpeed;

  if (deltaTime >= interval) {
    lastUpdateTime = currentTime;

    // Update the grid and display
    updateGridAndDisplay();
  }

  frameRequestId = requestAnimationFrame(updateLoop);
}



let isRunning = false;


function startGame() {
  if (!isRunning) {
    isRunning = true;
    frameRequestId = requestAnimationFrame(updateLoop);
  }
}

function stopGame() {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(frameRequestId);
  }
}


document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('stopButton').addEventListener('click', stopGame); // Add Stop button event listener
document.getElementById('resetButton').addEventListener('click', () => {
  stopGame();
  grid = new Array(numRows).fill(null).map(() => new Array(numCols).fill(false));
  const cells = document.getElementsByClassName('cell');
  for (let cell of cells) {
    cell.style.backgroundColor = '#fff';
  }
  updateGridAndDisplay(); // Update the grid display after reset
});

createGrid();
updateGridAndDisplay(); // Initial update of the grid display
