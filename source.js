class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      gameOver: false,
      playerX: 'Human',
      playerO: 'Human',
      activePlayer: 'X',
      x_wins: 0,
      o_wins: 0
    }
  }
  
  render() {
    return (
      <div>
        <ActionBar
          startNewGame = {this.startNewGame.bind(this)}
          togglePlayer = {this.togglePlayer.bind(this)}
          playerX = {this.state.playerX}
          playerO = {this.state.playerO}
          gameOver = {this.state.gameOver}
          activePlayer = {this.state.activePlayer}
        />
        <ScoreBar
          x_wins = {this.state.x_wins}
          o_wins = {this.state.o_wins}
        />
        <GameBoard
          ref = "gameboard"
          moveTurn = {this.moveTurn.bind(this)}
          endGame = {this.endGame.bind(this)}
          activePlayer = {this.state.activePlayer}
          gameOver = {this.state.gameOver}
          apIsHuman = {this.apIsHuman.bind(this)}
        />
      </div>
    );
  }
  
  apIsHuman(ap) {
    return (ap == "X") ?
      this.state.playerX == "Human" :
      this.state.playerO == "Human"
  }

  moveTurn(cell) {
    var ap = this.state.activePlayer;
    ap == "X" ? ap = "O" : ap = "X";
    
    this.setState({activePlayer: ap});
    
    // if active player is CPU, call gameboard CPU move
    if (!this.apIsHuman(ap)) this.refs.gameboard.cpuMove(ap);
  }
  
  endGame(winner) {
    if(winner=="X") this.setState({x_wins: this.state.x_wins + 1});
    if(winner=="O") this.setState({o_wins: this.state.o_wins + 1});
    this.setState({
      gameOver: true,
      activePlayer: false
    });
  }
  
  startNewGame() {
    this.setState({
      gameOver: !this.state.gameOver,
      activePlayer: "X"
    });
    
		const ap="X";
		this.refs.gameboard.resetBoard();
    
  }
  
  togglePlayer(player) {
    var ps = this.state[player];
    ps == "Human" ? ps = "CPU" : ps = "Human";
    this.setState({[player]: ps});
  }
  
}

class ActionBar extends React.Component {
  constructor(props) {
    super(props);
  }
  
  handlePlayerToggle(id) {
    this.props.togglePlayer(id);
  }
  
  handleResetClick() {
    console.log("Restarting");
    this.props.startNewGame();
  }
  
  render() {
    return (
      <div id="actionBar">
        <button
          onClick = {this.handleResetClick.bind(this)}
          disabled = {!this.props.gameOver}
        >
          {"New Game"}
        </button>
        
        <ActionPlayerButton
          id={"Player X"}
          player={this.props.playerX}
          togglePlayer = {this.handlePlayerToggle.bind(this, "playerX")}
          active={this.props.activePlayer=="X"}
        />
        
        <ActionPlayerButton
          id={"Player O"}
          player={this.props.playerO}
          togglePlayer = {this.handlePlayerToggle.bind(this, "playerO")}
          active={this.props.activePlayer=="O"}
        />
      </div>
    );
  }
}

function ActionPlayerButton(props) {
  var styles;
  if (props.active) styles = {background: '#99cc99'};
  
  return (
    <button
      onClick={props.togglePlayer}
      style={styles}
    >
      {props.id + ": " + props.player}
    </button>
  );
}


function ScoreBar(props) {
  return (
    <table id="scoreBar">
      <tr>
        <td>SCORE</td>
        <td>{props.x_wins}</td>
        <td>{props.o_wins}</td>
      </tr>
    </table>
  );
}


class GameBoard extends React.Component {
  // 9 positions on the game board
  // none defined to start
  //   1 | 2 | 3
  //  -----------
  //   4 | 5 | 6
  //  -----------
  //   7 | 8 | 9
  constructor(props) {
    super(props);
    
    this.state = {
      gameArr: new Array(9)
    };
    
  };
  
  rowsWinCheck(arr) {
    
    // first row check
    if (arr[0]) {
      if (arr[0] == arr[1] && arr[1] == arr[2]) return arr[0];
    };
    
    // second row
    if (arr[3]) {
      if (arr[3] == arr[4] && arr[4] == arr[5]) return arr[3];
    };
    
    // third row
    if (arr[6]) {
      if (arr[6] == arr[7] && arr[7] == arr[8]) return arr[6];
    };
    
    return false;
  }
  
  colsWinCheck(arr) {
    
    // first col check
    if (arr[0]) {
      if (arr[0] == arr[3] && arr[3] == arr[6]) return arr[0];
    };
    
    // second col
    if (arr[1]) {
      if (arr[1] == arr[4] && arr[4] == arr[7]) return arr[1];
    };
    
    // third col
    if (arr[2]) {
      if (arr[2] == arr[5] && arr[5] == arr[8]) return arr[2];
    };
    
    return false;
  }
  
  diagsWinCheck(arr) {
    
    if (arr[0]) {
      if (arr[0] == arr[4] && arr[4] == arr[8]) return arr[0];
    }
    
    if (arr[2]) {
      if (arr[2] == arr[4] && arr[4] == arr[6]) return arr[2];
    }
    
    return false;

  }

  // for a given 9 element game array
  // check for a winning arrangement
  // return false if none
  // else return the winning character
  checkForWin(arr) {
    return (
          this.rowsWinCheck(arr) ||
          this.colsWinCheck(arr) ||
          this.diagsWinCheck(arr)
    );
  }
  
  rowsAdvCheck(arr) {
    var ctr = 0;
    var rctr = 0;
    var antictr = 0;
    var i = 0;
    
    
    // first row check
    for (i = 0; i < 3; i++) {
      if(arr[i]== 'X') {rctr++;}
      else if(arr[i] == 'O') {antictr++;};
    };
    if (rctr >= 1 && antictr == 0) {ctr += rctr;}
    else if (antictr >= 1 && rctr == 0) {ctr -= antictr;};
    
    // second row
    rctr = 0;
    antictr = 0;
    for (i = 3; i < 6; i++) {
      if(arr[i]== 'X') {rctr++;}
      else if(arr[i] == 'O') {antictr++;};
    };
    if (rctr >= 1 && antictr == 0) {ctr += rctr;}
    else if (antictr >= 1 && rctr == 0) {ctr -= antictr;};
		
    // third row
    rctr = 0;
    antictr = 0;
    for (i = 6; i < 9; i++) {
      if(arr[i]== 'X') {rctr++;}
      else if(arr[i] == 'O') {antictr++;};
    };
   	if (rctr >= 1 && antictr == 0) {ctr += rctr;}
    else if (antictr >= 1 && rctr == 0) {ctr -= antictr;};
		
    return ctr;
  }
  
  colsAdvCheck(arr) {
    
    var pos = 0;
    var ctr = 0;
    var cctr = 0;
    var antictr = 0;
    var i = 0;
    
    
    // first col check
    for (i = 0; i < 3; i++) {
      pos = i*3 + 0;
      if(arr[pos]=='X') {cctr++;}
      else if(arr[pos] == 'O') {antictr++;};
    };
    if (cctr >= 1 && antictr == 0) {ctr += cctr;}
    else if (antictr >= 1 && cctr == 0) {ctr -= antictr;};
    
    
    // second col
    antictr = 0;
    cctr = 0;
    for (i = 0; i < 3; i++) {
      pos = i*3 + 1;
      if(arr[pos]=='X') {cctr++;}
      else if(arr[pos] == 'O') {antictr++;};
    };
    if (cctr >= 1 && antictr == 0) {ctr += cctr;}
    else if (antictr >= 1 && cctr == 0) {ctr -= antictr;};
    
    // third col
    antictr = 0;
    cctr = 0;
    for (i = 0; i < 3; i++) {
      pos = i*3 + 2;
      if(arr[pos]=='X') cctr++;
      if(arr[pos] == 'O') antictr++;
    };
    if (cctr >= 1 && antictr == 0) {ctr += cctr;}
    else if (antictr >= 1 && cctr == 0) {ctr -= antictr;};
  
    return ctr;
  }
  
  diagsAdvCheck(arr) {
    var ctr = 0;
    var dctr = 0;
    var i = 0;
    var antictr = 0;
    
    // first diag (\) check
    for (i = 0; i < 3; i++) {
      const pos = i*3 + i;
      if(arr[pos]=='X') {dctr++;}
      else if(arr[pos] == 'O') {antictr++;};
    };
    if (dctr >= 1 && antictr == 0) {ctr += dctr;}
    else if (antictr >= 1 && dctr == 0) {ctr -= antictr;};
    
    // second diag (/)
    antictr = 0;
    dctr = 0;
    for (i = 0; i < 3; i++) {
      const pos = i*3 + 2 - i;
      if(arr[pos]=='X') {dctr++;}
      else if(arr[pos] == 'O') {antictr++;};
    };
    if (dctr >= 1 && antictr == 0) {ctr += dctr;}
    else if (antictr >= 1 && dctr == 0) {ctr -= antictr;};
    
    return ctr;
  }

  // for a given 9 element game array
  // check for an advantageous arrangement
  // for player x (any line that has two
  // of that player's mark with no obstruction)
  // return the number of advantageous lines
  checkForAdv(arr) {
    return (
          this.rowsAdvCheck(arr) +
          this.colsAdvCheck(arr) +
          this.diagsAdvCheck(arr)
    );
  };
  
  
  moveTurn() {
    const winner = this.checkForWin(this.state.gameArr);
    winner ?
      this.props.endGame(winner):
      this.props.moveTurn();
  }
  
  /*
    evaluate a game state and calculate the score value of
    next possible step(s). this function will recursively iterate
    all viable possibilities
    
   INPUTS:
    moves
      the chain of moves that have gotten us to this state
      the initial call will be an empty array
    vArray
      the hypothetical state of game board
    vp
      virtual player's turn at this step
    alpha
      best value found so far for heuristic score (for maximizing player)
    beta
      best value found so far for heuristic score (for minimizing player)
    
    OUTPUTS:
    result: {score: {-1,0,1}, bestMove: {0-8}}
      the best calculated score for vp at this state and the moves
      which could result in that score
  */
  calcStep(depth, moves, vArray, vp, alpha, beta) {
    
    /*
    ----------------------------------------------------
    -------------BASE CASES-----------------------------
    ----------------------------------------------------
    */
    // check for win. value is maxed for a winner
    const didWin = this.checkForWin(vArray);
    if (didWin == 'X') {
      return {score: 100, move: null};
    } else if (didWin == 'O') {
      return {score: -100, move: null};
    }

    if (depth === 0) {
      return {score: this.checkForAdv(vArray), move: null};
    }
    
		// check if game board is full
    // do this by counting array values that are not undefined
    var valCnt = 0;
    for (var i = 0; i < vArray.length; i++) {
      if (vArray[i]) valCnt++;
    }
    if (valCnt == vArray.length) {
      return {score: 0, move: null};
    }
    /*
    ----------------------------------------------------
    -------------END BASE CASES---------------------------
    ----------------------------------------------------
    */

    // iterate over empty spots in vArray
    var bestMove = -1;
    
		var bestScore = (vp == 'X') ? alpha : beta;
		var nvp = vp == 'X' ? 'O' : 'X';

    // we can iterate over this in a random pattern later to make this
    // less deterministic
    for (var i = 0; i < vArray.length; i++) {
      if (!vArray[i]) {
        // for calculating scores of next state we need to
        // keep this trace of move sequence
        // will pop it back out at end of next recursive call
        moves.push(i);
        vArray[i] = vp;

        var thisScore = this.calcStep(depth-1, moves, vArray, nvp, alpha, beta).score;
        if (depth >= 4) {
					console.log('move:' + i + '    score: ' + thisScore);
				}
				// if this hScore is less optimal than prior,
        // skip over pushing, don't keep exploring the path
        if (vp == 'X' && thisScore > alpha) {
          bestScore = thisScore;
					alpha = thisScore;
          bestMove = i;
        }
        else if (vp == 'O' && thisScore < beta) {
          beta = thisScore;
          bestScore = thisScore;
          bestMove = i;
        }
          
        // now that score for move is calculated, undo it from
        // the queue and remove the symbol from vArray
        const lastMove = moves.pop();
        vArray[lastMove] = undefined;
				
				// if we have an alpha that's already greater than or equal to beta after
				// exploring down the branch, we don't need to investigate any other moves
				// at this depth
        if (alpha >= beta) {
					break;
        }
        

      }
    }

		if(depth >= 4) {
			console.log({score: bestScore, move: bestMove});
		}
		return {score: bestScore, move: bestMove};
    
    
  }
  
  
  // SIDE NOTE: I should probably store this graph in
  // state once it's calculated as an optimization
  // MAYBE. BUT NOT YET. FOCUS on SOLVE FIRST
  
  // positive scores are advantageous to player X
  // negative scores are advantageous to player O
  calcGraph(ap) {
    // the virtual array where we can speculate on moves
    const vArray = this.state.gameArr.slice(0);
    var moves = [];
    
    // the moves array - keep track of what squares are not yet taken
    /* DO NOT USE WITH calcStep since that is only meant to log where we
        are currently exploring
    for (var i = 0; i < vArray.length; i++) {
      if(!vArray[i]) moves.push(i);
    };
    */
    
    return this.calcStep(4, moves, vArray, ap, -Infinity, Infinity).move;
    // if there are multiple optimal paths, randomly choose one
    
    
  }
  
  
  cpuMove(ap) {
    // implement a graph search type of technique to score
    // all possible moves
    
    // recurse through the scores graph and implement a
    // maximin type algorithm until all possible moves
    // have been explored
    const bestMove = this.calcGraph(ap);
    
    
    // Randomly select between any move where scores are equal
    // also add a 0.5s delay
    setTimeout(()=>{this.markCell(bestMove, true)},500);
  }
  
  
  // refresh gameboard - make viewed board reflect internal array
  resetBoard() {
    this.setState({gameArr: new Array(9)}, function() {
			const ap = this.props.activePlayer;
			if(!this.props.apIsHuman(ap)) {this.cpuMove(ap)}
		});
		
  };
  
  // id is the cell in gameArray to be marked, didCpuMove is
  // a bool used to determine if CPU made the move
  markCell(id, didCpuMove) {
    // do nothing if game already over
    if (this.props.gameOver) return false;
    
    // disable human input if it's CPU's turn
    if (!this.props.apIsHuman(this.props.activePlayer) && !didCpuMove) {
      return false;
    };
    
    var gArray = this.state.gameArr;
    
    if (!gArray[id]) {
      gArray[id] = this.props.activePlayer;
      this.setState({gameArr: gArray});
      
      this.moveTurn();
      
      // if board is full, end game in a draw
      if (gArray.findIndex(el => {return !el}) < 0) {
        this.props.endGame(null);
      };
    } else {
      
      console.log("space already taken");
      
    }

  }
  
  renderCell(id) {
    return (
      <GameCell
        key={id}
        id={id}
        mark={this.state.gameArr[id]}
        markCell={this.markCell.bind(this, id, false)}
      />
    );
  }
  
  render() {
    return (
      <table className="gameTbl">
        <tr>
          {this.renderCell(0)}
          {this.renderCell(1)}
          {this.renderCell(2)}
        </tr>
        <tr>
          {this.renderCell(3)}
          {this.renderCell(4)}
          {this.renderCell(5)}
        </tr>
        <tr>
          {this.renderCell(6)}
          {this.renderCell(7)}
          {this.renderCell(8)}
        </tr>
        
      </table>
    );
  };
}

function GameCell(props) {
  return (
    <td onClick={props.markCell}>
      <span>{props.mark}</span>
    </td>
  );
}



const app = (
  <App />
);

ReactDOM.render(
  app,
  document.getElementById("root")
);