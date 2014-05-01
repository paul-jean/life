/** @jsx React.DOM */
(function() {

  var runningQ = false;
  var intervalID;
  var divSize = 10;
  var divBorderWidth = 1;
  // use a square grid:
  var gridSize = 50;

  var stepGame = function(gameState) {
    var newLiving = Array(),
        newDead = Array(), i, j, k, m;
    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++){
            var currNode = gameState.grid[i][j];
            var livingNeighbors = 0;
            //traverse the 8 cells around the current cell
            for(k = i - 1; k <= i + 1; k ++){
                for(m = j - 1; m <= j + 1; m ++){
                    if((k < 0) || (m < 0) || (k >= gridSize) || (m >= gridSize)){
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
        gameState.grid[killMe.yCord][killMe.xCord].val = 0;
    }
    for (i = 0; i < newLiving.length; i++) {
        var giveLife = newLiving[i];
        gameState.grid[giveLife.yCord][giveLife.xCord].val = 1;
    }
    return gameState;
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


  var Cell = React.createClass({
    render: function() {
      var dim = this.props.dim;
      var col = this.props.col;
      var row = this.props.row;
      var leftAlignQ = col === 0 ? true : false;
      var style = {
        width: 10,
        height: 10,
        backgroundColor: this.props.color, 
        border: "solid gray 1px",
        "float": "left",
        clear: leftAlignQ ? "both" : "none"
      };
      return (
        <div width = {dim} height = {dim} style = {style} >
        </div>
      );
    }
  });

  var Board = React.createClass({
    startAnimate: function() {
      var update = function(){
        this.setState(stepGame(this.state));
      }.bind(this);
      intervalId = setInterval(update, 100);
    },

    stopAnimate: function() {
      clearInterval(intervalId);
    },

    getInitialState: function () {
      return {grid: randomGameGrid(gridSize)};
    },
    render: function() {
      var a = [];
      for (var row=0; row<50; row++) {
        for (var col=0; col<50; col++) {
          a.push(<Cell
                 dim = '10' col = {col} row = {row}
                 color = {this.state.grid[row][col].val === 1 ? "black" : "white"}
                 />);
        }
      }
      return (
        <div>
          <input id="startButton" type="button" value="start" onClick={this.startAnimate}/>
          <input id="stopButton" type="button" value="stop" onClick={this.stopAnimate}/>
          <div width= {divSize * gridSize}>
            {a}
          </div>
        </div>
      )
    }
  });


  React.renderComponent(<Board />, document.getElementById("grid"));

})()
