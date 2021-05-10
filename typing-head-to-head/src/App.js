import React, {Component} from 'react'
import Game from './Game';
import './App.css';
import socketIOClient from "socket.io-client";
import WelcomePage from './WelcomePage';
import ModeSelection from './ModeSelection';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket: socketIOClient(),
      username: '',
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
      })
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

  findPrivateGame(room){
    this.setState({
      gameMatched: false,
      privateGame: true,
      privateRoom: room,
    })
    this.state.socket.emit("privateGame", room);
  }

  leaveGame(){  
    if(this.state.privateGame){
      this.state.socket.emit('leavePrivateRoom', this.state.privateRoom)
    }
    this.setState({
      //searchingForGame: false,
      soloGame: false,
      privateGame: false,
      privateRoom: '',
      gameMatched:false,
      words: []
    })
  }
  playAgain(){
    if(this.state.soloGame){
      this.state.socket.emit("soloGame")
    }
    else if(this.state.privateGame){
      this.findPrivateGame(this.state.privateRoom)
    }
    else{
      this.findGame()
    }
  }

  render(){
    if(this.state.username === ''){
      return(
        <WelcomePage 
          storeUsername={(username) => this.setState({username:username})}
          socket={this.state.socket}/>
      )
    }
    if(this.state.gameMatched){
      return (
        <div className="App">
          <Game 
            soloGame ={this.state.soloGame}
            playAgain={()=>this.playAgain()}
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
          <ModeSelection 
            socket={this.state.socket}
            findGame ={()=>this.findGame()}
            findSoloGame={()=>this.findSoloGame()}
            findPrivateGame={(room)=>this.findPrivateGame(room)}/>
        </div>
      )
    }
  }
}

export default App;
