import React, {Component} from 'react'

class GameTimer extends Component {
  render(){
    if(!this.props.gameStarted){
      return(<h1>Game starting in {this.props.gameCountDown} </h1>)
    }
    else{
      return(<h1>{this.displayMinutesAndSeconds(this.props.typingTimer)}</h1>)
    }
  }
}

export default GameTimer;