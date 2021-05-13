import React, {Component} from 'react'
import Chatbox from './Chatbox'

class PrivateRoom extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchingForGame: false,
      playersInRoom: 0
    }
  }

  componentDidMount(){
    this.props.socket.on('inWaiting', function(isWaiting){
      this.setState({searchingForGame : isWaiting})
    }.bind(this))
    this.props.socket.on('privateRoomSize', function(size){
      this.setState({playersInRoom : size})
    }.bind(this))
  }
  componentWillUnmount(){
    this.props.socket.off('inWaiting');
    this.props.socket.off('privateRoomSize');
  }

  render(){
    return(  
      <div>
        <div className='gameModes'>
          <h1>Private Room: {this.props.privateRoom}</h1>
          <h2>There is currently {this.state.playersInRoom} {this.state.playersInRoom === 1 ? 'user' : 'users'} in this room</h2>
          <div className='gameMode'>
            <div class="privateRoomButtons">
              <button onClick={this.props.findPrivateGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button> 
              <button onClick={this.props.leaveGame.bind(this)}>Leave private room</button>
            </div>
              <Chatbox 
                    socket={this.props.socket}
                    username={this.props.username}
                    roomName={this.props.privateRoom}
              />
          </div>

        </div>
      </div>
    )
  }
}

export default PrivateRoom;