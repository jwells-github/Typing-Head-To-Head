import React, {Component} from 'react'

class TypingProgress extends Component {
  render(){
    let wordList = [];
    for(var i = 0; i < this.props.words.length; i++){
      let itemClass = "word "
      if(i < this.props.progress ){
        itemClass += "completedWord"
      }
      else if(i === this.props.progress ){
        itemClass += "currentWord"
      }
      wordList.push(<li className={itemClass} key={i}>{this.props.words[i]}</li>)
    }
    return(
      <ul>
        {wordList}    
      </ul>
    )
  }
}

export default TypingProgress;