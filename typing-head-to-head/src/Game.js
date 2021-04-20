import React, {Component} from 'react'
import './App.css';
import TypingProgress from './TypingProgress';

const avgCharactersInWord = 5;
let timer;

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: this.props.words,
      playerPosition : 0,
      opponentPosition: 0,
      gameCountDown: 5,
      gameStarted : false,
      typingFinished: false,
      raceWinner: false,
      typingStartTime : 0,
      typingEndTime: 0,
      typingTimer: 0,
      playerWPM: 0,
      opponentWPM: 0,
    } 
  }

  componentDidMount(){
    this.props.socket.on('word-send', function(position){
      this.setState({opponentPosition : position})
    }.bind(this))
    this.props.socket.on('endRace', function(winnerID){
      let isWinner = this.props.socket.id === winnerID
      this.setState({
        typingFinished: true, 
        raceWinner : isWinner,
        opponentPosition: isWinner ? this.state.opponentPosition : this.state.words.length,
        playerWPM: this.calculateWPM(this.state.playerPosition),
        opponentWPM: this.calculateWPM(isWinner ? this.state.opponentPosition : this.state.words.length)
      })
    }.bind(this))
    this.props.socket.on('countdown', function(time){
      let gameStarted = time < 1
      this.setState(
        {
          gameCountDown : time,
          gameStarted: gameStarted,
          typingStartTime : Date.now()
        });
        if(gameStarted){
          let timer = setInterval(() => {
            if(this.state.typingFinished){
              clearInterval(timer)
              return;
            }

            this.setState({
              typingTimer : Date.now() - this.state.typingStartTime,
              playerWPM: this.calculateWPM(this.state.playerPosition),
              opponentWPM : this.calculateWPM(this.state.opponentPosition)})

          }, 1000);
          document.getElementById("TypingInput").focus();
        }
    }.bind(this))
  }

  calculateWPM(position){
    let typingTime = Date.now()
    let standardisedWordCount = this.state.words.slice(0,position).join(' ').length / avgCharactersInWord
    let wpm = Math.round(standardisedWordCount / ((typingTime - this.state.typingStartTime ) / 60000))
    return wpm
  }

  compareInput(event){
    if(this.state.typingStarted === false){
      this.setState({
        typingStarted : true,
        typingStartTime : Date.now()
      })
    }
    let input = event.target.value
    let inputChar = input.substring(event.target.value.length-1,input.length)
    let currentWord = this.state.words[this.state.playerPosition]
    if(inputChar === " "){
      if(input.substring(0,input.length-1) === currentWord){
        event.target.value = ""
        event.target.style.background = "white"
        this.props.socket.emit('word', this.state.playerPosition + 1)
        this.setState({
          playerPosition: this.state.playerPosition +1,
        })
        return
      }
    }
    // Final word
    if(this.state.playerPosition +1 >= this.state.words.length){
      if(input === currentWord){
        let typingEndTime = Date.now()
        this.props.socket.emit('complete', this.state.typingTimer)
        clearInterval(timer);
        this.setState({
          playerPosition: this.state.playerPosition +1,
          typingFinished: true,
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
    let topDisplay = <h1>{this.displayMinutesAndSeconds(this.state.typingTimer)}</h1>;
    if(this.state.typingFinished){
      userInput = 
      <div>
        <h1>{this.state.raceWinner ? "win" : "lose"}</h1>
        <button onClick={this.props.findGame}>Search for another game</button>
      </div>
    }
    else if(!this.state.gameStarted){
      userInput = 
        <div>
          <input id="TypingInput" disabled="disabled"></input>
        </div>
      topDisplay = <h1>Game starting in {this.state.gameCountDown}  </h1>
    }
    else{
      userInput = 
        <div>
          <input id="TypingInput" onInput={this.compareInput.bind(this)}></input>
        </div>
      
    }
    return (
      <div className="Game">
        {topDisplay}
        <div className="Players">
          <div className="PlayerOne">
            <h2>You</h2>
            <div>
              <h2>{this.state.playerWPM} WPM</h2>
              <TypingProgress words={this.state.words} progress={this.state.playerPosition}/>
            </div>
            <div>
              {userInput}
            </div>
          </div>
          <div className="PlayerTwo">
            <h2>Your opponent</h2>
            <div>
              <h2>{this.state.opponentWPM} WPM</h2>
              <TypingProgress words={this.state.words} progress={this.state.opponentPosition}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Game;
