import React, {Component} from 'react'

class GameInput extends Component {
  render(){
    if(this.props.typingFinished){  
      return(
        <div>
          <h1>{this.props.raceWinner ? "win" : "lose"}</h1>
          <button onClick={this.props.findGame}>Search for another game</button>
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
          <input id="TypingInput" onInput={this.props.compareInput}/>
        </div>
      )
    }
  }
}

export default GameInput;