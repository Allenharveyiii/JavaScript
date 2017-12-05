//Code from http://www.geeksforgeeks.org/printing-solutions-n-queen-problem/
//Used to practice writing backtracking algorithms in JavaScript
solveNQ(8);




/* A utility function to check if a queen can
   be placed on board[row][col]. Note that this
   function is called when "col" queens are
   already placed in columns from 0 to col -1.
   So we need to check only left side for
   attacking queens */
function isSafe(row, colunm, array){
    var i, j;
    
       /* Check this row on left side */
       for (i = 0; i < colunm; i++)
           if (array[row][i])
               return false;
    
       /* Check upper diagonal on left side */
       for (i=row, j=colunm; i>=0 && j>=0; i--, j--)
           if (array[i][j])
               return false;
    
       /* Check lower diagonal on left side */
       for (i=row, j=colunm; j>=0 && i<array.length; i++, j--)
           if (array[i][j])
               return false;
    
       return true;
}
/* A recursive utility function to solve N
   Queen problem */
    function solveNQUtil(array, col)
    {
    /* base case: If all queens are placed
        then return true */
    if (col >= array.length)
        return true;

    /* Consider this column and try placing
        this queen in all rows one by one */
    for (var i = 0; i < array.length; i++)
    {
        /* Check if queen can be placed on
            board[i][col] */
        if ( isSafe(i, col, array) )
        {
            /* Place this queen in board[i][col] */
            array[i][col] = 1;

            /* recur to place rest of the queens */
            if ( solveNQUtil(array, col + 1) )
                return true;

            /* If placing queen in board[i][col]
                doesn't lead to a solution, then
                remove queen from board[i][col] */
            array[i][col] = 0; // BACKTRACK
        }
    }
    
        /* If queen can not be place in any row in
           this colum col  then return false */
       return false;
   }
    
   /* This function solves the N Queen problem using
      Backtracking. It mainly uses solveNQUtil() to
      solve the problem. It returns false if queens
      cannot be placed, otherwise return true and
      prints placement of queens in the form of 1s.
      Please note that there may be more than one
      solutions, this function prints one  of the
      feasible solutions.*/
function solveNQ(N)
{ 
    var array = _2DArray(N, N, 0);
    
    if ( solveNQUtil(array, 0) == false )
    {
        console.log("Solution does not exist");
        return false;
    }
    
    display_2DArray(array);
    return true;
}

function _2DArray(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

function display_2DArray(array){
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (j == array.length - 1) {
                process.stdout.write(array[i][j]+'');
            }else{
                process.stdout.write(array[i][j]+'-');
            }
            
        }
        console.log();
    }
}
