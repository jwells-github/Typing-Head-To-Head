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
    this.state.socket.emit('findGame', 'hmmm')
  }

  render(){
    if(this.state.gameMatched){
      return (
        <div className="App">
          <Game 
            findGame={()=>this.findGame()}
            words={this.state.words} 
            socket={this.state.socket}
            leaveGame={()=>this.setState({gameMatched : false})}  
            />
        </div>
      )
    }
    else{
      return (
        <div className="App">
          <button onClick={this.findGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button>
        </div>
      )
    }
  }
}

export default App;
