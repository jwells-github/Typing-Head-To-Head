import React, {Component} from 'react'
import './App.css';
import Player from './Player';
import GameInput from './GameInput';

const avgCharactersInWord = 5;

class Game extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {
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
    this._isMounted = true;
    this.props.socket.on('updateOpponentPosition', function(position){
      this.setState({opponentPosition : position})
    }.bind(this))
    this.props.socket.on('endRace', function(winnerID){
      let isWinner = this.props.socket.id === winnerID
      // Do not update user stats after finishing a solo game
      if(!this.props.soloGame){
        this.props.socket.emit('raceStats', this.calculateWPM(this.state.playerPosition), isWinner)
      }
      if(this._isMounted){
        this.setState({
          typingFinished: true, 
          raceWinner : isWinner,
          opponentPosition: isWinner ? this.state.opponentPosition : this._words.length,
          playerWPM: this.calculateWPM(this.state.playerPosition),
          opponentWPM: this.calculateWPM(isWinner ? this.state.opponentPosition : this._words.length)
        })
      }
    }.bind(this))
    this.props.socket.on('countdown', function(time){
      let gameStarted = time < 1
      if(this._isMounted){
        this.setState(
          {
            gameCountDown : time,
            gameStarted: gameStarted,
            typingStartTime : Date.now()
          });
      }
      if(gameStarted){
        this.timer = setInterval(() => {
          if(this.state.typingFinished){
            clearInterval(this.timer)
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

  componentWillUnmount(){
    clearInterval(this.timer)
    this._isMounted = false;
    this.props.socket.off('updateOpponentPosition');
    this.props.socket.off('endRace');
    this.props.socket.off('countdown');
  }

  calculateWPM(position){
    let typingTime = Date.now()
    let standardisedWordCount = this._words.slice(0,position).join(' ').length / avgCharactersInWord
    let wpm = Math.round(standardisedWordCount / ((typingTime - this.state.typingStartTime ) / 60000))
    return wpm
  }

  compareInput(event){
    let input = event.target.value
    let inputChar = input.substring(event.target.value.length-1,input.length)
    let currentWord = this._words[this.state.playerPosition]
    if(inputChar === " "){
      if(input.substring(0,input.length-1) === currentWord){
        event.target.value = ""
        event.target.style.background = "white"
        this.props.socket.emit('wordComplete', this.state.playerPosition + 1)
        this.setState({
          playerPosition: this.state.playerPosition +1,
        })
        return
      }
    }
    // Final word
    if(this.state.playerPosition +1 >= this._words.length){
      if(input === currentWord){
        this.props.socket.emit('raceComplete');
        this.setState({
          playerPosition: this.state.playerPosition +1,
          typingFinished: true,
          typingEndTime : Date.now(),
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

  playAgain(){
    this.setState({
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
    })
    this.props.playAgain()
  }

  render(){
    this._words = this.props.gameData.passage.text.split(' ');
    this._userData = this.props.gameData.playerOne.id === this.props.socket.id ? this.props.gameData.playerOne : this.props.gameData.playerTwo;
    this._opponentData = this.props.gameData.playerOne.id !== this.props.socket.id ? this.props.gameData.playerOne : this.props.gameData.playerTwo;
    this._passageTitle = this.props.gameData.passage.title;

    let topDisplay = <h1>{this.displayMinutesAndSeconds(this.state.typingTimer)}</h1>;
    if(!this.state.gameStarted){
      topDisplay = <h1>Game starting in {this.state.gameCountDown}  </h1>
    }
    return (
      <div className="Game">
        {topDisplay}
        <div className="players">
          <div className="playerOne">
            <Player 
              opponent={false} 
              username={this.props.username}
              wpm={this.state.playerWPM} 
              recordWPM={this._userData.recordWPM}
              winLoss={this._userData.winLoss}
              progress={this.state.playerPosition}
              words={this._words}
              passageTitle = {this._passageTitle}
              typingFinished = {this.state.typingFinished}
              />
            <div>
              <GameInput
                typingFinished={this.state.typingFinished}
                raceWinner={this.state.raceWinner}
                playAgain={this.playAgain.bind(this)}
                leaveGame={this.props.leaveGame}
                gameStarted={this.state.gameStarted}
                compareInput ={this.compareInput.bind(this)}
              />
            </div>
          </div>
          <div>
            {this.props.soloGame ? <span></span> : <span className="versus">VS</span>}
          </div>
          <div className={this.props.soloGame ? "" : "playerTwo"}>
            <Player 
              opponent={true} 
              username={this._opponentData.username}
              recordWPM={this._opponentData.recordWPM}
              winLoss={this._opponentData.winLoss}
              wpm={this.state.opponentWPM} 
              progress={this.state.opponentPosition}
              words={this._words}
              soloGame={this.props.soloGame}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default Game;
