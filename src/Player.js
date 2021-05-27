import React, {Component} from 'react'
import TypingProgress from './TypingProgress';

class Player extends Component {  
  render(){
    if(this.props.soloGame){
      return(<div></div>)
    }
    let  passageTitle = <div>
      <span className="passageTitle">This was a passage from {this.props.passageTitle}</span>
    </div>
    return(
      <div>
        <div>
          <h2>{this.props.username}</h2>
          <div className="playerStatistics">
            <span>{this.props.winLoss}</span>
            <span>Record WPM {this.props.recordWPM}</span>
          </div>
          <h2>{this.props.wpm} WPM</h2>
        </div>
          <div className="typingProgress">
            <TypingProgress opponent={this.props.opponent} words={this.props.words} progress={this.props.progress}/>
            {this.props.typingFinished && !this.props.soloGame ? passageTitle : ''}
          </div>
      </div>
    )
  }
}

export default Player;