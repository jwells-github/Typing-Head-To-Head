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
    this.setState({
      gameMatched: false,
      privateGame: true,
      privateRoom: roomInput.value,
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
        <div>
          <form onSubmit={this.setUsername.bind(this)}>
            <label>Enter a username</label>
            <input id='username' placeholder="Username"></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }
    if(this.state.gameMatched){
      let playAgain;
      if(this.state.soloGame){
        playAgain = () => {this.findSoloGame()}
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
          <button onClick={this.findGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button>
          <button onClick={this.findSoloGame.bind(this)}>Play Solo</button>
          <div>
            <form onSubmit={this.joinPrivateRoom.bind(this)}>
              <label>Join a private Room</label>
              <input id='privateRoom' placeholder="room name"></input>
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
      )
    }
  }
}

export default App;
