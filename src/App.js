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
      privateRoom: '',
      gameMatched:false,
      gameData: {},
      playersInPublicRoom: 0, 
      publicChatHistory : [],
      privateChatHistory: []
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
      this.setState({playersInPublicRoom : size})
    }.bind(this))
    this.state.socket.on('updatePublicChat', function(username, chatMessage){
      console.log('public')
      this.updatePublicChat(username, chatMessage);
    }.bind(this))
    this.state.socket.on('updatePrivateChat', function(username, chatMessage){
      console.log('private')
      this.updatePrivateChat(username, chatMessage);
    }.bind(this))
  }

  updatePublicChat(username,chatMessage){
    this.setState({
      publicChatHistory : this.state.publicChatHistory.concat(this.createChatMessage(username,chatMessage))
    });
  }

  updatePrivateChat(username,chatMessage){
    this.setState({
      privateChatHistory : this.state.privateChatHistory.concat(this.createChatMessage(username,chatMessage))
    });
  }

  createChatMessage(username, chatMessage){
    return         <li key={username+Date.now()}>
      <span className="chatUsername">{username}:</span>
      <span className="chatMessage">{chatMessage}</span>
    </li>
  }

  findGame(){
    this.setState({gameMatched: false})
    this.state.socket.emit('toggleMatchmaking', this.state.privateRoom)
  }

  findSoloGame(){
    this.setState({soloGame: true, gameMatched: false})
    this.state.socket.emit("soloGame")
  }

  joinPrivateRoom(room){
    this.state.socket.emit('joinPrivateRoom', room)
    this.setState({
      gameMatched: false,
      privateRoom: room,
    })
  }

  leavePrivateRoom(room){
    this.state.socket.emit('leavePrivateRoom', room)
    this.setState({
      privateRoom: '',
      privateChatHistory: []
    })
  }

  leaveGame(){  
    this.setState({
      soloGame: false,
      gameMatched:false,
      words: []
    })
  }
  playAgain(){
    if(this.state.soloGame){
      this.state.socket.emit("soloGame")
    }
    else{
      this.findGame()
    }
  }

  render(){
    if(this.state.username === ''){
      return(
        <div className="App">
          <WelcomePage 
            storeUsername={(username) => this.setState({username:username})}
            socket={this.state.socket}/>
        </div>
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
            leaveGame={()=>this.leaveGame()}  />
        </div>
      )
    }
    else{
      if(this.state.privateRoom !== ''){
        return(
          <div className="App">
            <PrivateRoom
              socket = {this.state.socket}
              username = {this.state.username}
              privateRoom = {this.state.privateRoom}
              findPrivateGame = {()=>this.findGame()}
              leaveRoom = {()=>this.leavePrivateRoom()}
              chatMessages ={this.state.privateChatHistory}
              updateChat ={(username,chatMessage) => this.updatePrivateChat(username,chatMessage)}/>
          </div>
        )
      }
      return (
        <div className="App">
          <ModeSelection 
            socket={this.state.socket}
            username = {this.state.username}
            playersInPublicRoom ={this.state.playersInPublicRoom}
            findGame ={()=>this.findGame()}
            findSoloGame={()=>this.findSoloGame()}
            joinPrivateRoom={(room)=>this.joinPrivateRoom(room)}
            chatMessages={this.state.publicChatHistory}
            updateChat ={(username,chatMessage) => this.updatePublicChat(username,chatMessage)}
            />
        </div>
      )
    }
  }
}

export default App;
