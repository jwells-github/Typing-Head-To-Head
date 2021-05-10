import React, {Component} from 'react'

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
      console.log(size)
      this.setState({playersInRoom : size})
    }.bind(this))
  }
  componentWillUnmount(){
    this.props.socket.off('inWaiting');
  }

  render(){
    return(  
      <div>
        <h1>Private Room: {this.props.privateRoom}</h1>
        <h2>There is currently {this.state.playersInRoom} {this.state.playersInRoom === 1 ? 'user' : 'users'} in this room</h2>
        <button onClick={this.props.findPrivateGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button> 
        <button onClick={this.props.leaveGame.bind(this)}>Leave private room</button>
      </div>
    )
  }
}

export default PrivateRoom;