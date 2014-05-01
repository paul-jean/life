;(function(exports) {

  var gameState;
  var gameGrid;
  var intervalId;
  var divSize = 10;
  var divBorderWidth = 1;
  // use a square grid:
  var gridSize = 50;

  var startAnimate = function() {
    var update = function(){
      gameState = stepGame(gameState);
      updateGrid(gameState);
    };
    intervalId = setInterval(update, 500);
  };

  var stopAnimate = function() {
    clearInterval(intervalId);
  };

  var initGame = function() {
    return(
      {
      dim: gridSize,
      grid: randomGameGrid(gridSize)
    }
    );
  };

  var newGrid = function() {
    var row, col;
    gameGrid = document.getElementById("grid");
    gameGrid.style.width = divSize * gridSize;
    // add 50 child divs for each row, with row ids 0-49
    for (row = 0; row < gridSize; row ++) {
      var rowDiv = document.createElement('div');
      rowDiv.id = "r" + row;
      // for each row div, add 50 child divs for each column, with column ids 0-49
      for (col = 0; col < gridSize; col ++) {
        var rowColDiv = document.createElement('div');
        rowColDiv.id = rowDiv.id + "c" + col;
        rowColDiv.style.width = divSize - 2 * divBorderWidth;
        rowColDiv.style.height = divSize - 2 * divBorderWidth;
        // left-align the first cell div in each row:
        if (col === 0) {
          rowColDiv.style.clear = "both";
        }
        rowColDiv.style.cssFloat = "left";
        rowColDiv.style.borderStyle = "solid";
        rowColDiv.style.borderColor = "gray";
        rowColDiv.style.borderWidth = divBorderWidth + "px";
        rowColDiv.style.backgroundColor = "white";
        // TODO is this field on the div actually necessary?
        // I don't seem to be using it right now :-/
        // rowColDiv.valObj = gameState.grid[row][col];
        rowDiv.appendChild(rowColDiv);
      }
      gameGrid.appendChild(rowDiv);
    }
    // TODO add click event listeners to divs
  };

  var updateGrid = function(gameState) {
    var row, col, cellId, rowColDiv;
    for (row = 0; row < gameState.dim; row ++) {
      for (col = 0; col < gameState.dim; col ++) {
        cellId = "r" + row + "c" + col;
        rowColDiv = document.getElementById(cellId);
        if (gameState.grid[row][col].val === 1 && rowColDiv.style.backgroundColor === "black") {
          rowColDiv.style.backgroundColor = "gray";
        } else if (gameState.grid[row][col].val === 0 && rowColDiv.style.backgroundColor === "white") {
          rowColDiv.style.backgroundColor = "gray";
        } else if (gameState.grid[row][col].val === 1) {
          rowColDiv.style.backgroundColor = "black";
        } else if (gameState.grid[row][col].val === 0) {
          rowColDiv.style.backgroundColor = "white";
        }
      }
    }
  };

  var stepGame = function(gameState) {
    var newState = initGame(),
        newLiving = Array(),
        newDead = Array(), i, j, k, m;
    newState.grid = gameState.grid;
    for(i = 0; i < gameState.dim; i++){
        for(j = 0; j < gameState.dim; j++){
            var currNode = gameState.grid[i][j];
            var livingNeighbors = 0;
            //traverse the 8 cells around the current cell
            for(k = i - 1; k <= i + 1; k ++){
                for(m = j - 1; m <= j + 1; m ++){
                    if((k < 0) || (m < 0) || (k >= gameState.dim) || (m >= gameState.dim)){
                        continue;
                    }
                    livingNeighbors += gameState.grid[k][m].val;
                }
            }
            if(currNode.val){
                livingNeighbors--;
            }
            //update life of cell
            if (currNode.val){
                if((livingNeighbors <= 1) || (livingNeighbors > 3)){
                    var deadCords = {yCord: i, xCord: j};
                    newDead.push(deadCords);
                }
            } else{
                if (livingNeighbors == 3) {
                    var lifeCords = {yCord: i, xCord: j};
                    newLiving.push(lifeCords);
                }
            }
        }
    }
    for (i = 0; i < newDead.length; i++) {
        var killMe = newDead[i];
        newState.grid[killMe.yCord][killMe.xCord].val = 0;
    }
    for (i = 0; i < newLiving.length; i++) {
        var giveLife = newLiving[i];
        newState.grid[giveLife.yCord][giveLife.xCord].val = 1;
    }
    return newState;
  };

  var randomGameGrid = function (dim){
    var grid = new Array(dim), i;
    for (i = 0; i < dim; i++){
        grid[i] = new Array(dim);
    }
    for (i = 0; i < dim; i++){
        for(var j = 0; j < dim; j++){
          if (Math.random() < 0.5) {
            grid[i][j] = {val:0};
          } else {
            grid[i][j] = {val:1};
          }
        }
    }
    return grid;
  };

  exports.onload = function() {
    newGrid();
    gameState = initGame();
    updateGrid(gameState);
  };
  exports.startAnimate = startAnimate;
  exports.stopAnimate = stopAnimate;

})(this);
