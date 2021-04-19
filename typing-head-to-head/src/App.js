import React, {Component} from 'react'
import Game from './Game';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket : socketIOClient(),
      gameMatched:false,
      words: []
    }
  }
  componentDidMount(){
    this.state.socket.on('gameReady', function(words){
      this.setState({
        gameMatched:true,
        words:words.text.split(' ')
      })
    }.bind(this))
  }

  findGame(){
    console.log(this.state.socket.id)
    this.state.socket.emit('findGame', 'hmmm')
  }

  render(){
    if(this.state.gameMatched){
      return (
        <div className="App">
          <Game words={this.state.words} socket={this.state.socket}/>
        </div>
      )
    }
    else{
      return (
        <div className="App">
          <button onClick={this.findGame.bind(this)}>Find a game</button>
        </div>
      )
    }
  }
}

export default App;
