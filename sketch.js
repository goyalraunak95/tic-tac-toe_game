
// X is User
// O is AI


// Tic Tac Toe Matrix
var tic_tac_toe = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Different HTML Elements

//message gives the result of the game(Win,Lose,Tie)
const $message = document.getElementById("message");

//cells will showcase 'X' and 'O' in each cell of tic tac toe.
const $cells = document.querySelectorAll(".cell");

/*restartButton will restart the game,resetting all the classes in 
each cell and clear out the message.*/
const $restartButton = document.getElementById("Restart");

// Click Listener will listen the event of clcking on restart button
$restartButton.addEventListener("click", clearGrid);


//Functionality(Below) , when user click on a given cell during his/her turn.
//To achive that , click listener is added to each cell.

//Traversing each and every cell.
$cells.forEach((item) => {
//Adding event listener to each cell for clicking.   
  item.addEventListener("click", () => {

    /* This function will run whenever user will click on any box , 
    if the user is allowed to , and will put 'X' in that cell , 
    and will also reflect the same changes in variable tic_tac_toe*/
    
    // Provide position on tic tac toe matrix of user input
    let {row,col} = getPosition(item.id);

    // If game is not ended and position is empty then only play the game
    if(tic_tac_toe[row][col] == null && checkResult(tic_tac_toe) == null)
    {

      console.log(tic_tac_toe)

      // Fill the tic tac toe matrix and give visual representation to user.
      gridFill(item.id, "X");

      // Check the result wheather the game is over or not and if it is over ,who won.
      let result = checkResult(tic_tac_toe)

      // If game is ended stop the game.
      if(result!=null)
        stopGame(result);
      else
      { 
        // Time delay of 0.5 s for ai's turn to give user a real time game. 
        setTimeout(() => {
          aiTurn()
        },150)
      }
      
    }

  });

});

// Function to fill tic tac toe matrix and to give user a visual representation
function gridFill(id, text) {

  // Get position of input in tic tac toe matrix
  let {row,col} = getPosition(id);

  // Fill the matrix if position is empty
  if(tic_tac_toe[row][col] == null)
  {
    // Fill the tic tac toe matrix
    tic_tac_toe[row][col] = text;

    // Display the input to user
    document.getElementById(id).innerHTML = text;

    /*Restricting the user and ai to not to fill this cell again 
    by adding 'not-allowed' class in that cell.*/
    $cells[id-1].classList.add('not-allowed');
  }

}

// Function for ai's turn
function aiTurn() {

  // Get the optimal move position for ai using minimax.
  let move = aiMove(tic_tac_toe);

  //id for the cell.
  let id;

  // Find the id using matrix position.
  if(move!=null){
  id = 3 * move.row + move.col + 1;
  }

  // Fill the tic tac toe matrix.
  gridFill(id, "O");

  // Check the result
  let result = checkResult(tic_tac_toe)

  // If game is ended , stop the game.
  if(result!=null)
    stopGame(result)

}

// Function to restart the game
function clearGrid() {

  // Clear all grids 
  $cells.forEach((item) => {
    item.innerHTML = null;
    item.classList.remove("not-allowed");
  });

  // Clear the tic tac toe matrix
  for(let row=0;row<3;row++)
  {
    for(let col=0;col<3;col++)
      tic_tac_toe[row][col] = null;
  }

  // Clear the result message
  $message.innerHTML = null;

  // Disable the restart button
  $restartButton.disabled = true;

}

// Function to check the result
function checkResult(grid) {

  // Result of the game
  let result = null;
  
  /* If their is any row in which all three columns have same symbol then 
  player with that symbol won the match*/
  for (let row = 0; row < 3; row++) {
    if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2] && grid[row][0]!=null) {
      result = grid[row][0];
      return result;
    }
  }
  
  /* If their is any column in which all three rows have same symbol then 
  player with that symbol won the match*/
  for (let col = 0; col < 3; col++) {
    if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col] && grid[0][col]!=null) {
      result = grid[0][col];
      return result;
    }
  }
  
  // If right diagonal is equal.
  if ( grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] != null ) {
    result = grid[0][0];
    return result;
  }
  
  // If left diagonal is equal.
  if ( grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0] && grid[0][2] != null ) {
    result = grid[0][2];
    return result;
  }

  // Legal moves to play in game. 
  let legalMove = 0;

  // Check all the position in tic tac toe matrix.
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {

      // Increase legal move by 1 if position is empty.
      if (grid[row][col] == null) legalMove++;
    }
  }
  // If legal moves are zero then game is tied.
  if (legalMove === 0) {
    result = "T";
  }

  // Return the result
  return result;
}

// Fuction to calculate ai's move taking tic_tac_toe as an input locally by the name of grid
function aiMove(grid) {

  //move is the co-ordinate of the cell in grid, which is AI's next optimally founded move in favor of AI.
  let move;

  /*AI could have diffrent moves , but AI's next turn will be whose score is the highest, 
  which is also the best score out of all the possible scores*/ 
  let bestScore = -Infinity;

  //depth is the level in the minmax tree,where currently the state of grid sits.
  let depth = 0;
  
  
  //Exploring diffrent options where AI's next move is possible, by traversing the whole grid.
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {

      //If the cell is vacant,it could be a possible AI's next move.
      if (grid[row][col] == null) {

        //Making this cell as AI's next move. 
        grid[row][col] = "O";

        //Determing the score , if this cell is the next AI's move.
        let score = minimax(grid, depth, false,-Infinity,+Infinity);

        //Resetting the AI's move to null, so that future computations on the same grid doesn't get hindered.
        grid[row][col] = null;

        //If the determined score is the maximum so far, take this as AI's next move.
        if (score > bestScore) {
          //Putting the determined score into the best score.
          bestScore = score;

          //Putting co-ordinates of the cell into variable move which has given best score so far. 
          move = { row, col };
        }
      }
    }
  }

  //Returning the optimally decided AI's move
  return move;

}

// Utility function to obtain result for minimax algorithm
var utility = {
  O: 10,
  X: -10,
  T: 0
};

function minimax(grid, depth, maximize,alpha,beta) {

  //Check wheater the game is over or not.
  let result = checkResult(grid);

  //If the game is over return the utility value in accordance to who wins the game.
  if (result != null) {
    return utility[result];
  }
  

  //If it is maximizer's turn.
  if (maximize) {
    
    /*Maximizer can have options for diffrent moves , out of which the move 
    that will give the maximum score will in variable bestScore*/
    let bestScore = -Infinity;

    // Variable pruned will be a state , that will tell wheather the current node and it's subsequent nodes are pruned or not 
    let pruned = false;
    
    //Exploring diffrent options where Maximizer's next move is possible,by traversing the whole grid.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {

        //If the cell is vacant,it could be a possible Maximizer's next move.
        if (grid[row][col] == null) {

          //Making this cell as Maximizer's next move. 
          grid[row][col] = "O";

          /*Determing the score , if this cell is the next Maximizer's move.
            minimax called recursively with 
            input as the grid,
            an increased depth by one as the next state of the grid after filling 'O' will be a level greater than the present level,
            fliping the maximizing move to minimizing move by passing the maximizing move to be false,
            and the value of alpha and beta for pruning the minimax tree.*/
          let score = minimax(grid, depth + 1, false,alpha,beta) - depth;
          /*If the maximizer is winning at a lower value of depth , 
          then there is no need to take maximizer's move to be of higher depth,
          so to take depth into account , score is subtracted with the depth as the score is positive.*/ 
          
          //Resetting the Maximizer's move to null, so that future computations on the same grid doesn't get hindered.
          grid[row][col] = null;
          
          //If the determined score is the maximum so far, take this as Maximizer's next move.
          if (score > bestScore) {
            
            //Putting the determined score into the best score.
            bestScore = score;
          }

          //Finding the value of alpha for maximizer's move.
          alpha = (bestScore>alpha)?bestScore:alpha
          
          //Applying the condition of alpha-beta pruning. 
          if(alpha>=beta)
          {
              //Making the state of pruning of minimmax tree to be true. 
              pruned = true;
          }
        }
      }
      
      //If the pruned state is true , break the current loop to prune the minimax node and it's subsequent nodes in the tree.
      if(pruned)
          break;
    }

    //Returning the optimally decided Maximizer's move
    return bestScore;
  }

  //If it is minimizer's turn.
  if (!maximize) {

    /*Minimizer can have options for diffrent moves , out of which the move 
    that will give the minimum score will in variable bestScore.*/
    let bestScore = +Infinity;

    // Variable pruned will be a state , that will tell wheather the current node and it's subsequent nodes are pruned or not.
    let pruned = false;

    //Exploring diffrent options where Minimizer's next move is possible,by traversing the whole grid.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {

        //If the cell is vacant,it could be a possible Minimizer's next move.
        if (grid[row][col] == null) {

          //Making this cell as Minimizer's next move. 
          grid[row][col] = "X";

          /*Determing the score , if this cell is the next Minimizer's move.
            minimax called recursively with 
            input as the grid,
            an increased depth by one as the next state of the grid after filling 'X' will be a level greater than the present level,
            fliping the minimizing move to maximizing move by passing the maximizing move to be true,
            and the value of alpha and beta for pruning the minimax tree.*/
          let score = minimax(grid, depth + 1, true,alpha,beta) + depth;
          /*If the minimizer is winning at a lower value of depth , 
          then there is no need to take minimizer's move to be of higher depth,
          so to take depth into account , score is added with the depth as the score is negative.*/ 

          //Resetting the Minimizer's move to null, so that future computations on the same grid doesn't get hindered.
          grid[row][col] = null;

          //If the determined score is the minimum so far, take this as Minimizer's next move.
          if (score < bestScore) {

            //Putting the determined score into the best score.
            bestScore = score;
          }

          //Finding the value of beta for minimizer's move.
          beta = (bestScore<beta)?bestScore:beta

          //Applying the condition of alpha-beta pruning. 
          if(alpha>=beta)
          {
              //Making the state of pruning of minimmax tree to be true. 
              pruned = true;
          }
        }
      }

      //If the pruned state is true , break the current loop to prune the minimax node and it's subsequent nodes in the tree.
      if(pruned)
          break;

    }

    //Returning the optimally decided Minimizer's move
    return bestScore;
  }

}

// Function to stop the game
function stopGame(result) {

  /*Traversing each cell to add 'not-allowed' class , 
  so that user and AI can't click/access on the cell as the game is over.*/
  $cells.forEach((item) => {
    item.classList.add("not-allowed");
  });

  // Enable the restart button
  $restartButton.disabled = false;

  // Show result to the user
  if(result === 'X')
    $message.innerHTML = "You Won the Match"
  else if(result === 'O')
    $message.innerHTML = "You Lose the Match"
  else
    $message.innerHTML = "The Game is Tied"  

}

/* Function to find the co-ordinates of a paricular cell in tic tac toe matrix
   using the cell's  id*/
function getPosition(id){

  // Variable position will contain the co-ordinates of the cell with given id.
  let position;


  let col = id % 3;

  // Id is divided by 3 to find row, as each row contains 3 id's.
  let row = id / 3;

  if (col === 0) {
    col = 3;
  }

  //To follow 0 indexing.
  col--;

  //If variable row is an integer , then subtract 1 , to follow 0 indexing. 
  if (row - Math.floor(row) === 0) {
    row = row - 1;
  }

  //If variable row is float , take it's floor value, to assure 0 indexing. 
  row = Math.floor(row);

  //Putting the co-ordinates in the variable position.
  position = {row,col};

  //Returnig the co-ordinates of cell with a given id.
  return position;

}