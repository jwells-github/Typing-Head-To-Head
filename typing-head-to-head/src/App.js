import React, {Component} from 'react'
import Game from './Game';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket : socketIOClient(),
      searchingForGame: false,
      soloGame: false,
      privateGame: false,
      privateRoom: '',
      gameMatched:false,
      words: []
    }
  }
  componentDidMount(){
    this.state.socket.on('gameReady', function(words){
      this.setState({
        gameMatched:true,
        words:words.text.split(' '),
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
    let room = document.getElementById("privateRoom");
    this.setState({
      gameMatched: false,
      privateGame: true,
      privateRoom: room.value
    })
    this.findPrivateGame(room.value);
    room.value = "";
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
    if(this.state.gameMatched){
      console.log(this.state.soloGame)
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
            words={this.state.words} 
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
