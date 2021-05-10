import React, {Component} from 'react'

class PrivateRoom extends Component {

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

  render(){
    return(  
      <div>
        <h1>You are waiting for a game in private room: {this.props.privateRoom}</h1>
        <button onClick={this.props.findPrivateGame.bind(this)}>{this.state.searchingForGame ? "Leave queue" : "Find a Game"}</button> 
        <button onClick={this.props.leaveGame.bind(this)}>Leave private room</button>
      </div>
    )
  }
}

export default PrivateRoom;