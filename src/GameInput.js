import React, {Component} from 'react'

class GameInput extends Component {
  render(){
    if(this.props.typingFinished){  
      return(
        <div className="gameFinishedDialogue">
          <div>
            <h1>{this.props.raceWinner ? "You win!" : "You lose"}</h1>
          </div>
          <button onClick={this.props.playAgain}>Play again</button>
          <button onClick={this.props.leaveGame}>Leave game</button>
        </div>
      )
    }
    else if(!this.props.gameStarted){
      return(
        <div>
          <input id="TypingInput" disabled="disabled"/>
        </div>
      )
    }
    else{
      return(
        <div>
          <input id="TypingInput" onInput={this.props.compareInput} autoComplete="off"/>
        </div>
      )
    }
  }
}

export default GameInput;