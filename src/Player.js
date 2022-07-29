import React, {Component} from 'react'
import TypingProgress from './TypingProgress';

class Player extends Component {  
  render(){
    if(this.props.soloGame && this.props.opponent){
      return(<div></div>)
    }
    let usernameAppend = this.props.soloGame ? '' : (this.props.opponent ? '' : '(You)')
    let  passageTitle = <div>
      <span className="passageTitle">This was a passage from {this.props.passageTitle}</span>
    </div>
    return(
      <div>
        <div>
          <h2>{this.props.username} {usernameAppend}</h2>
          <div className="playerStatistics">
            <span>{this.props.winLoss}</span>
            <span>Record WPM {this.props.recordWPM}</span>
          </div>
          <h2>{this.props.wpm} WPM</h2>
        </div>
          <div className="typingProgress">
            <TypingProgress opponent={this.props.opponent} words={this.props.words} progress={this.props.progress}/>
            {this.props.typingFinished  ? passageTitle : ''}
          </div>
      </div>
    )
  }
}

export default Player;