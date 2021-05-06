import React, {Component} from 'react'
import Game from './Game';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket: socketIOClient(),
      username: '',
      searchingForGame: false,
      soloGame: false,
      privateGame: false,
      privateRoom: '',
      gameMatched:false,
      gameData: {}
    }
  }
  componentDidMount(){
    this.state.socket.on('gameReady', function(gameData){
      this.setState({
        gameMatched:true,
        gameData: gameData,
        searchingForGame: false
      })
    }.bind(this))
    this.state.socket.on('inWaiting', function(isWaiting){
      this.setState({searchingForGame : isWaiting})
    }.bind(this))
  }

  findGame(){
    this.setState({gameMatched: false})
    this.state.socket.emit('findGame')
  }

  findSoloGame(){
    this.setState({soloGame: true, gameMatched: false})
    this.state.socket.emit("soloGame")
  }

  joinPrivateRoom(event){
    event.preventDefault();
    let roomInput = document.getElementById("privateRoom");
    if(roomInput.value.trim() === ''){
      return;
    }
    this.setState({
      gameMatched: false,
      privateGame: true,
      privateRoom: roomInput.value.trim(),
      searchingForGame: false,
      soloGame: false,
    })
    this.findPrivateGame(roomInput.value);
    roomInput.value = "";
  }

  
  setUsername(event){
    event.preventDefault();
    let usernameInput = document.getElementById("username");
    this.setState({
      username: usernameInput.value
    })
    this.state.socket.emit("setUsername", usernameInput.value);
  }

  findPrivateGame(room){
    this.setState({
      gameMatched: false,
      privateGame: true,
    })
    this.state.socket.emit("privateGame", room);
  }

  leaveGame(){  
    if(this.state.privateGame){
      this.state.socket.emit('leavePrivateRoom', this.state.privateRoom)
    }
    this.setState({
      searchingForGame: false,
      soloGame: false,
      privateGame: false,
      privateRoom: '',
      gameMatched:false,
      words: []
    })
  }

  render(){
    if(this.state.username === ''){
      return(
        <div className="App">
          <div id="welcomePage">
            <h1>Typing Head-To-Head</h1>
            <p>Typing Head-To-Head is a game that can be played solo or against an opponent. Players are given a passage of text and are challenged to type it as quickly as possible</p>
            <p>Enter a username to play!</p>
            <div>
              <form onSubmit={this.setUsername.bind(this)}>
                <input id='username' placeholder="Your username"></input>
                <button type="submit">Enter</button>
              </form>
            </div>
          </div>
        </div>
      )
    }
    if(this.state.gameMatched){
      let playAgain;
      if(this.state.soloGame){
        playAgain = () => {this.state.socket.emit("soloGame")}
      }
      else if(this.state.privateGame){
        playAgain = () =>{this.findPrivateGame(this.state.room)}
      }
      else{
        playAgain = () => {this.findGame()}
      }
      return (
        <div className="App">
          <Game 
            soloGame ={this.state.soloGame}
            playAgain={playAgain}
            username={this.state.username}
            gameData={this.state.gameData} 
            socket={this.state.socket}
            leaveGame={()=>this.leaveGame()}  
            />
        </div>
      )
    }
    else{
      if(this.state.privateGame){
        return(
          <div>
            <h1>You are waiting for a game in private room: {this.state.privateRoom}</h1>
            <button onClick={this.leaveGame.bind(this)}>Leave {this.state.privateRoom}</button>
          </div>
        )
      }
      return (
        <div className="App">
          <h1>Typing Head-To-Head</h1>
          <div className="gameModes">
            <div className="gameMode">
              <h2>Public Head-To-Head</h2>
              <div className="gameDescription">
                <div>
                  <p>Match against another random player in a head-to-head battle to determine who is the superior typist!</p>
                  <p>The outcome of games will count towards your total number of Wins and Losses. Your personal best typing speed will also be recorded</p>
                </div>
                <button className="playButton" onClick={this.findGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button> 
              </div>
            </div>
            <div className="gameMode">
              <h2>Solo Practice Game</h2>
              <div className="gameDescription">
                <div>
                  <p>Play a game by yourself to hone your typing skills, warm up or just to play without the stress of competition</p>
                  <p>The outcome of games will <span className="underline">not</span> count towards your total number of Wins and Losses. Your personal best typing speed will <span className="underline">not</span> be recorded</p>
                </div>
                <button onClick={this.findSoloGame.bind(this)} className="playButton">Play Solo</button>
              </div>
            </div>
            <div className="gameMode">
              <h2>Join a Private Gameroom</h2>
              <div className="gameDescription">
                <div>
                  <p>Filter your matchmaking to only play against players in the same private room as you.</p>
                  <p>The outcome of games will count towards your total number of Wins and Losses. Your personal best typing speed will also be recorded</p>
                  <form onSubmit={this.joinPrivateRoom.bind(this)}>
                    <input id='privateRoom' placeholder="Room name"></input>
                    <button className="playButton" type="submit">Join</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
