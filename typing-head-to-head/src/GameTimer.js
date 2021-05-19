import React, {Component} from 'react'

class GameTimer extends Component {
  displayMinutesAndSeconds(timer){
    let minutes = Math.floor(timer / 60000);
    let seconds = ((timer % 60000) / 1000).toFixed(0);
    return (seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
  }

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