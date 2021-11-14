//This function is used to draw the game
function drawCanvas() {

    //Check if we have received our canvas element
    if (canvas == null) {
        console.log("Something went wrong and the game canvas was unable to generate");
        return;
    }
    //Ensure that the grid has been set
    if (grid == null) {
        grid = createGrid(currentLevel);
    }
    //clear canvas
    canvas.clearRect(0, 0, 288, 288);

    //Populate goal array
    createGoalArray(currentLevel);

    //draw background colour
    canvas.fillStyle = '#488AC7';
    canvas.fillRect(0, 0, window.innerWidth, window.innerHeight);

    //draw level
    for (var i = 0; i < grid.length; i++) {

        for (var j = 0; j < grid[i].length; j++) {

            //determine what objects to draw. Uses  i and j * width and height of tile for positioning
            if (grid[i][j] == 1) {

                canvas.drawImage(wall, j * tileWidth, i * tileHeight);      //draw wall

            } else if (grid[i][j] == 2) {

                canvas.drawImage(player, j * tileWidth, i * tileHeight);    //draw player

            } else if (grid[i][j] == 3 && arrayCheck(goalArray, [i, j])) {  //if array index is a box and the box is on a goal location

                canvas.drawImage(boxGoal, j * tileWidth, i * tileHeight);   //draw box on goal

            } else if (grid[i][j] == 3) {

                canvas.drawImage(box, j * tileWidth, i * tileHeight);   //draw box

            } else if (grid[i][j] == 4) {

                canvas.drawImage(goal, j * tileWidth, i * tileHeight);  //draw goal

            }
        }

    }
    //If the player has won and there are more levels to play
    if (win == true && levels.includes(currentLevel + 1)) {
        //update scoreboard
        let scoreDiv = document.getElementById('score');
        document.getElementById("nextlevel").style.visibility = "visible";  //display next level button
        if (!scoreSet) {
            scoreDiv.innerHTML += "<br /> level " + currentLevel + " step count: " + stepCount;
            scoreSet = true;
        }

    }
    //If the player has won and there are no more levels to play
    else if (win == true && !levels.includes(currentLevel + 1)) {
        //update scoreboard
        let scoreDiv = document.getElementById('score');
        document.getElementById("finish").style.visibility = "visible"; //display replay button
        if (!scoreSet) {
            scoreDiv.innerHTML += "<br /> level " + currentLevel + " step count: " + stepCount;
            scoreSet = true;
        }
    }

    //Display general game information
    document.getElementById("currentLevel").innerHTML = "Level: " + currentLevel;
    document.getElementById("stepCount").innerHTML = "Step Count: " + stepCount;
}

//This function will be used to create an array representing the game grid.
function createGrid(level) {
    let array = [];
    let levelOneArray = [
        0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 1, 4, 1, 0, 0, 0,
        0, 0, 1, 3, 1, 1, 1, 1,
        1, 1, 1, 0, 2, 3, 4, 1,
        1, 4, 0, 3, 3, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 4, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0
    ];

    let levelTwoArray = [
        1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 0,
        1, 0, 3, 0, 1, 0, 1, 1, 1,
        1, 0, 3, 2, 1, 0, 1, 4, 1,
        1, 1, 1, 3, 1, 1, 1, 4, 1,
        0, 1, 1, 0, 0, 0, 0, 4, 1,
        0, 1, 0, 0, 0, 1, 0, 0, 1,
        0, 1, 0, 0, 0, 1, 1, 1, 1,
        0, 1, 1, 1, 1, 1, 0, 0, 0
    ];

    //Depending on the level, set the grid height for splicing into 2D array
    if (level == 1) {
        gridWidth = 8;


    } else if (level == 2) {
        //Level 2
        gridWidth = 9;
    }


    //Push contents of level 1 into 2D array
    if (level == 1) {
        while (levelOneArray.length) {
            //This will create an array of arrays, using the gridWidth to determine max index of each sub-array
            array.push(levelOneArray.splice(0, gridWidth));
        }
    } else if (level == 2) {
        while (levelTwoArray.length) {
            array.push(levelTwoArray.splice(0, gridWidth));
        }
    }

    return array;
}
//This function defines player movement controls.
function move(e) {
    var keynum;

    if (window.event) { // IE                  
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                 
        keynum = e.which;
    }


    if (!win) {
        if (keynum == 68) {
            updatePosition(2, "right"); //Moving right

        }
        //left
        if (keynum == 65) {
            updatePosition(2, "left"); //Moving left

        }
        //up
        if (keynum == 87) {
            updatePosition(2, "up"); //Moving up

        }
        //down
        if (keynum == 83) {
            updatePosition(2, "down"); //Moving down

        }
    }

    checkWin(); //Check if the player has won
    requestAnimationFrame(drawCanvas);
}

//This function will handle movement of objects in the game
function updatePosition(object, direction) {

    currentGrid = grid; //Save the grid before changes are made.

    xLoop:
            for (var i = 0; i < grid.length; i++) {
        yLoop:
                for (var j = 0; j < grid.length; j++) {

            if (grid[i][j] == object) {

                //player is moving down and the space is free
                if (direction == "down" && !isWall(grid[i + 1][j]) && !boxCollision(grid[i + 1][j], grid[i + 2][j])) {

                    grid[i][j] = 0; //set current position to a blank space

                    //Check if box can move
                    if (checkBox(grid[i + 1][j]) && grid[i + 2][j] == 0 || grid[i + 2][j] == 4) {
                        grid[i + 2][j] = 3; //Move box into position ahead of the new player position
                    }

                    grid[i + 1][j] = object;    //Move object to new position
                    stepCount += 1; //Increase the step count

                    break xLoop;    //break from outer loop

                }
                //player is moving up and the space is free
                else if (direction == "up" && !isWall(grid[i - 1][j]) && !boxCollision(grid[i - 1][j], grid[i - 2][j])) {

                    grid[i][j] = 0; //Set current position to a blank space

                    //Check if box can move
                    if (checkBox(grid[i - 1][j]) && grid[i - 2][j] == 0 || grid[i - 2][j] == 4) {
                        grid[i - 2][j] = 3; //Move box into position ahead of new player position
                    }

                    grid[i - 1][j] = object;    //Move player to new position
                    stepCount += 1; //Increase step count
                    break xLoop;    //Break from outer loop

                }

                //Player is moving left and the space is free
                else if (direction == "left" && !isWall(grid[i][j - 1]) && !boxCollision(grid[i][j - 1], grid[i][j - 2])) {
                    grid[i][j] = 0; //Set current position to blank space

                    //Check if a box can move
                    if (checkBox(grid[i][j - 1]) && grid[i][j - 2] == 0 || grid[i][j - 2] == 4) {
                        grid[i][j - 2] = 3; //Update box position ahead of new player position
                    }

                    grid[i][j - 1] = object;    //Move player into new position
                    stepCount += 1; //Increase step count
                    break xLoop;   //Break from outer loop

                }
                //Player is moving right and the space is free
                else if (direction == "right" && !isWall(grid[i][j + 1]) && !boxCollision(grid[i][j + 1], grid[i][j + 2])) {

                    grid[i][j] = 0; //Set current position to blank space

                    //Check if a box can move
                    if (checkBox(grid[i][j + 1]) && grid[i][j + 2] == 0 || grid[i][j + 2] == 4) {
                        grid[i][j + 2] = 3; //Update box position ahead of new player position
                    }

                    grid[i][j + 1] = object;    //Move player into new position
                    stepCount += 1; //Increase step count
                    break xLoop;   //Break from outer loop
                }
            }
        }
    }

    //This loop will check if any goals in the level are missing, then set the value to 4 so that they will be redrawn
    for (var i = 0; i < goalArray.length; i++) {

        if (grid[goalArray[i][0]][goalArray[i][1]] == 0) {
            grid[goalArray[i][0]][goalArray[i][1]] = 4;
        }

    }
}

//A simple check to see if a position has a box
function checkBox(position) {
    if (position == 3) {
        return true;
    }
}

//checks if the player is colliding with a wall
function isWall(position) {

    if (position == 1) {
        return true;
    } else {
        return false;
    }

}

//This method is used to handle box collisions
function boxCollision(positionBox, positionWall) {
    if (positionBox == 3 && (positionWall == 1 || positionWall == 3)) {
        return true;
    }
}

//Check if the player has won
function checkWin() {

    //get subarray of grid array using the goalArray as indexes
    let gridGoal = [];
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (arrayCheck(goalArray, [i, j])) {
                gridGoal.push(grid[i][j]);
            }
        }
    }
    //loop through gridGoal array to determine if there is a win.
    if (gridGoal.length > 0) {
        win = gridGoal.every(element => element == 3);
    } else {
        console.log("Something went wrong generating goal");
    }
}

//Generate a goal array based on the current level
function createGoalArray(level) {
    if (level == 1) {
        goalArray = [
            [4, 1],
            [1, 3],
            [3, 6],
            [6, 4]
        ];
    } else if (level == 2) {
        goalArray = [
            [3, 7],
            [4, 7],
            [5, 7]
        ];
    }
}

//This function will handle what happens when the next level button is pressed
function nextLevel() {

    //Switch to next level
    currentLevel = currentLevel + 1;
    grid = createGrid(currentLevel);   //Draw the new game map
    win = false;            //Set win back to false
    stepCount = 0;          //Reset step count
    scoreSet = false;       //Set boolean to false
    document.getElementById("nextlevel").style.visibility = "hidden";   //Hide next level button
    requestAnimationFrame(drawCanvas);
}

//This function is used to restart the current level
function restart() {
    grid = createGrid(currentLevel);
    stepCount = 0;
    requestAnimationFrame(drawCanvas);
    win = false;
    scoreSet = false;       //Set boolean to false
}

//This button will be used to restart the whole game
function restartGame() {
    currentLevel = 1;
    grid = createGrid(currentLevel);
    win = false;
    stepCount = 0;
    scoreSet = false;       //Set boolean to false
    document.getElementById("finish").style.visibility = "hidden";
    document.getElementById("score").innerHTML = "";
    requestAnimationFrame(drawCanvas);
}

//This function checks if an array exists inside a collection of arrays
function arrayCheck(array, item) {
    var itemString = JSON.stringify(item);  //convert array to JSON string

    //Check to see whether the stringified array is inside the collection of arrays
    var contains = array.some(function (element) {
        return JSON.stringify(element) == itemString;
    });
    return contains;
}

//Global variables
var canvas = null;
var currentGrid = [];  //An array which stores the current state of the game board.
var win = false;
var levels = [1, 2];
var currentLevel = levels[0];
var tileWidth = 32;     //The width and height of a single grid tile.
var tileHeight = 32;
var gridHeight = null;
var grid = createGrid(currentLevel);
var stepCount = 0;
var scoreSet = false;    //This variable checks if the score has been at the end of each level
var goalArray = [];     //This ill be used to store the location of the goals in each level

//game sprites
var wall = new Image;
wall.src = 'Sprites/Wall.png';
var player = new Image;
player.src = 'Sprites/Player.png';
var playerPosition = []; //Used to store current player position
var box = new Image;
box.src = 'Sprites/Box.png';
var hasBox = false; //This will determine whether a position has a box. 
var goal = new Image;
goal.src = 'Sprites/Goal.png';
var boxGoal = new Image;
boxGoal.src = 'Sprites/BoxGoal.png';

//Get canvas element
window.onload = function () {
    canvas = document.getElementById('game').getContext('2d');
    requestAnimationFrame(drawCanvas);
}

document.onkeyup = move;    //Execute the move method when the key is released
