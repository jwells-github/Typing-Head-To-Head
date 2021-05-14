import React, {Component} from 'react'
import Chatbox from './Chatbox'

class ModeSelection extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchingForGame: false,
      privateRoomNameError: false,
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
    if(this.isIllegalRoomName(roomInput.value.trim())){
      this.setState({privateRoomNameError: true})
      return;
    }
    this.props.joinPrivateRoom(roomInput.value.trim());
    roomInput.value = "";
  }

  isIllegalRoomName(room){
    var matchesPublicWaitingRoom = /\bpublicWaitingRoom\b/.test(room)
    var matchesMatchmaking = /-MATCHMAKING$/.test(room)
    if(matchesPublicWaitingRoom || matchesMatchmaking){
      return true;
    }
    else{
      return false;
    }
  }

  render(){
    return(  
      <div>
        <h1>Typing Head-To-Head</h1>
        <h2>{this.props.playersInPublicRoom} {this.props.playersInPublicRoom === 1 ? 'user' : 'users'} connected</h2>
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
            <Chatbox 
              socket={this.props.socket}
              username={this.props.username}
              chatMessages = {this.props.chatMessages}
              updateChat ={(username,chatMessage) =>this.props.updateChat(username,chatMessage)}
              roomName={''} // Empty string signifies public room
            />
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
                  {this.state.privateRoomNameError ? <span className="errorMessage">Your room name contains a reserved phrase. Please select a new name</span> : ''}
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