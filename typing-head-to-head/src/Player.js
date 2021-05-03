import React, {Component} from 'react'
import TypingProgress from './TypingProgress';

class Player extends Component {  
  render(){
    if(this.props.soloGame){
      return(<div></div>)
    }
    return(
      <div className={!this.props.opponent ? "PlayerOne" : "PlayerTwo"}>
        <h2>{!this.props.opponent ? "You" : "Your opponent"}</h2>
        <h3>{this.props.username}</h3>
        <h4>Record WPM {this.props.recordWPM}</h4>
        <h4>{this.props.winLoss}</h4>
        <div>
          <h2>{this.props.wpm} WPM</h2>
          <TypingProgress words={this.props.words} progress={this.props.progress}/>
        </div>
    </div>
    )
  }
}

export default Player;