import React, {Component} from 'react'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: ["The","big","dog","named","Dave","ate","sausages!"],
      currentPosition : 0,
      typingStarted : false,
      typingFinished: false,
      typingStartTime : 0,
      typingEndTime: 0,
      typingTimer: 0,
      wpm: 0
    } 
  }

  compareInput(event){
    if(this.state.typingStarted === false){
      this.setState({
        typingStarted : true,
        typingStartTime : Date.now()
      })
      this.timer = setInterval(() => {
        this.setState({typingTimer : Date.now() - this.state.typingStartTime})
      }, 10);
    }
    let input = event.target.value
    let inputChar = input.substring(event.target.value.length-1,input.length)
    let currentWord = this.state.words[this.state.currentPosition]
    if(inputChar === " "){
      if(input.substring(0,input.length-1) === this.state.words[this.state.currentPosition]){
        event.target.value = ""
        event.target.style.background = "white"
        // Final word
        if(this.state.currentPosition +1 >= this.state.words.length){
          let typingEndTime = Date.now()
          clearInterval(this.timer);
          let standardisedWordCount = this.state.words.join(' ').length / 5
          let wpm = standardisedWordCount / ((typingEndTime - this.state.typingStartTime ) / 60000)
          this.setState({
            typingFinished: true,
            wpm : Math.round(wpm),
            typingEndTime : typingEndTime
          })
          console.log('WPM ' + wpm)
        }
        this.setState({currentPosition: this.state.currentPosition +1})
        return
      }
    }
    if (currentWord.substring(0,input.length) !== input){
      event.target.style.background = "red"
    }
    else{
      event.target.style.background = "white"
    }
  }
  render(){
    const wordList = [];
    for(var i = 0; i < this.state.words.length; i++){
      let itemClass = "word "
      if(i < this.state.currentPosition ){
        itemClass += "completedWord"
      }
      else if(i === this.state.currentPosition ){
        itemClass += "currentWord"
      }
      wordList.push(<li className={itemClass} key={i}>{this.state.words[i]}</li>)
    }
    return (
      <div className="App">
        <div>
          <h1>{this.state.typingTimer}</h1>
          <h2>{this.state.wpm} WPM</h2>
          <ul>
            {wordList}
          </ul>
          <h1>{this.state.words[this.state.currentPosition]}</h1>
        </div>
        <div>
          <input onInput={this.compareInput.bind(this)}></input>
        </div>
      </div>
    )
  }
}

export default App;
