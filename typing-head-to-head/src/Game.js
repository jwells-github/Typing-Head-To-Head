import React, {Component} from 'react'
import './App.css';
import TypingProgress from './TypingProgress';

const avgCharactersInWord = 5;

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: this.props.words,
      currentPosition : 0,
      opponentPosition: 0,
      typingStarted : false,
      typingFinished: false,
      raceWinner: false,
      typingStartTime : 0,
      typingEndTime: 0,
      typingTimer: 0,
      wpm: 0
    } 
  }

  componentDidMount(){
    this.props.socket.on('word-send', function(position){
      this.setState({opponentPosition : position})
    }.bind(this))
    this.props.socket.on('endRace', function(winnerID){
      this.setState({typingFinished: true, raceWinner : this.props.socket.id === winnerID })
    }.bind(this))
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
      if(input.substring(0,input.length-1) === currentWord){
        event.target.value = ""
        event.target.style.background = "white"
        this.props.socket.emit('word', this.state.currentPosition + 1)
        this.setState({currentPosition: this.state.currentPosition +1})
        return
      }
    }
    // Final word
    if(this.state.currentPosition +1 >= this.state.words.length){
      if(input === currentWord){
        let typingEndTime = Date.now()
        this.props.socket.emit('complete', this.state.typingTimer)
        clearInterval(this.timer);
        let standardisedWordCount = this.state.words.join(' ').length / avgCharactersInWord
        let wpm = standardisedWordCount / ((typingEndTime - this.state.typingStartTime ) / 60000)
        this.setState({
          currentPosition: this.state.currentPosition +1,
          typingFinished: true,
          wpm : Math.round(wpm),
          typingEndTime : typingEndTime,
          raceWinner: true
        })
      }
    }
    if (currentWord.substring(0,input.length) !== input){
      event.target.style.background = "red"
    }
    else{
      event.target.style.background = "white"
    }
  }
  resetApp(){
    this.getPassage().then(response =>{
      console.log(response.text)
      this.setState({
        words: response.text.split(' '),
        currentPosition : 0,
        typingStarted : false,
        typingFinished: false,
        typingStartTime : 0,
        typingEndTime: 0,
        typingTimer: 0,
      })
    })

  }
  displayMinutesAndSeconds(timer){
    let minutes = Math.floor(timer / 60000);
    let seconds = ((timer % 60000) / 1000).toFixed(0);
    return (seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
  }

  getPassage(){
    return new Promise((resolve,reject) =>{
      fetch('/test/')
      .then(res => {
        resolve(res.json())
      })
    })
  }

  render(){
    let userInput;
    if(this.state.typingFinished){
      userInput = 
      <div>
        <h1>{this.state.raceWinner ? "win" : "lose"}</h1>
        <button onClick={this.resetApp.bind(this)}>Retry</button>
      </div>
    }
    else{
      userInput = 
      <div>
        <input onInput={this.compareInput.bind(this)}></input>
      </div>
    }
    return (
      <div className="App">
        <div>
          <h1>{this.displayMinutesAndSeconds(this.state.typingTimer)}</h1>
          <h2>{this.state.wpm} WPM</h2>
          <TypingProgress words={this.state.words} progress={this.state.currentPosition}/>
        </div>
        <div>
          {userInput}
        </div>
        <div><TypingProgress words={this.state.words} progress={this.state.opponentPosition}/></div>
      </div>
    )
  }
}

export default Game;
