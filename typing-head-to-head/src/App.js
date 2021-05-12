import React, {Component} from 'react'
import Game from './Game';
import './App.css';
import socketIOClient from "socket.io-client";
import WelcomePage from './WelcomePage';
import ModeSelection from './ModeSelection';
import PrivateRoom from './PrivateRoom';

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
      gameData: {},
      playersInRoom: 0,
    }
  }
  componentDidMount(){
    this.state.socket.on('gameReady', function(gameData){
      this.setState({
        gameMatched:true,
        gameData: gameData,
      })
    }.bind(this))
    this.state.socket.on('publicRoomSize', function(size){
      this.setState({playersInRoom : size})
    }.bind(this))
  }

  findGame(){
    this.setState({gameMatched: false})
    this.state.socket.emit('matchmakeMe', '')
  }

  findSoloGame(){
    this.setState({soloGame: true, gameMatched: false})
    this.state.socket.emit("soloGame")
  }

  joinPrivateRoom(room){
    this.state.socket.emit('joinPrivateRoom', room)
    this.setState({
      gameMatched: false,
      privateGame: true,
      privateRoom: room,
    })
  }
  leavePrivateRoom(room){
    this.state.socket.emit('leavePrivateRoom', room)
  }
  findPrivateGame(){  
    this.state.socket.emit("matchmakeMe", this.state.privateRoom);
  }

  leaveGame(){  
    if(this.state.privateRoom !== ''){
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
          <PrivateRoom
            socket = {this.state.socket}
            username = {this.state.username}
            privateRoom = {this.state.privateRoom}
            findPrivateGame = {()=>this.findPrivateGame()}
            leaveGame = {()=>this.leaveGame()}
          />
        )
      }
      return (
        <div className="App">
          <ModeSelection 
            socket={this.state.socket}
            username = {this.state.username}
            playersInRoom ={this.state.playersInRoom}
            findGame ={()=>this.findGame()}
            findSoloGame={()=>this.findSoloGame()}
            joinPrivateRoom={(room)=>this.joinPrivateRoom(room)}/>
        </div>
      )
    }
  }
}

export default App;
