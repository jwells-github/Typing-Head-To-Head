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

  soloGame(){
    console.log('sologame')
    this.setState({soloGame: true, gameMatched: false})
    this.state.socket.emit("soloGame")
  }

  leaveGame(){
    this.setState({
      searchingForGame: false,
      soloGame: false,
      gameMatched:false,
      words: []
    })
  }

  render(){
    if(this.state.gameMatched){
      console.log(this.state.soloGame)
      return (
        <div className="App">
          <Game 
            soloGame ={this.state.soloGame}
            playAgain={()=>{this.state.soloGame ? this.soloGame() : this.findGame() }}
            words={this.state.words} 
            socket={this.state.socket}
            leaveGame={()=>this.leaveGame()}  
            />
        </div>
      )
    }
    else{
      return (
        <div className="App">
          <button onClick={this.findGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button>
          <button onClick={this.soloGame.bind(this)}>Play Solo</button>
        </div>
      )
    }
  }
}

export default App;
