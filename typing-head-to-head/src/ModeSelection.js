import React, {Component} from 'react'

class ModeSelection extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchingForGame: false,
    }
  }
  componentDidMount(){
    this.props.socket.on('inWaiting', function(isWaiting){
      this.setState({searchingForGame : isWaiting})
    }.bind(this))
  }
  componentWillUnmount(){
    this.props.socket.off('inWaiting');
  }

  joinPrivateRoom(event){
    event.preventDefault();
    let roomInput = document.getElementById("privateRoom");
    if(roomInput.value.trim() === ""){
      return;
    }    
    this.props.findPrivateGame(roomInput.value.trim());
    roomInput.value = "";
  }

  render(){
    return(  
      <div>
        <h1>Typing Head-To-Head</h1>
        <div className="gameModes">
          <div className="gameMode">
            <h2>Public Head-To-Head</h2>
            <div className="gameDescription">
              <div>
                <p>Match against another random player in a head-to-head battle to determine who is the superior typist!</p>
                <p>The outcome of games will count towards your total number of Wins and Losses. Your personal best typing speed will also be recorded</p>
              </div>
              <button className="playButton" onClick={this.props.findGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button> 
            </div>
          </div>
          <div className="gameMode">
            <h2>Solo Practice Game</h2>
            <div className="gameDescription">
              <div>
                <p>Play a game by yourself to hone your typing skills, warm up or just to play without the stress of competition</p>
                <p>The outcome of games will <span className="underline">not</span> count towards your total number of Wins and Losses. Your personal best typing speed will <span className="underline">not</span> be recorded</p>
              </div>
              <button onClick={this.props.findSoloGame.bind(this)} className="playButton">Play Solo</button>
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

export default ModeSelection;