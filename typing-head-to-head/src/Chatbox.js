import React, {Component} from 'react'

class ChatBox extends Component {

  constructor(props){
    super(props);
    this.state = {
      chatMessages: [<li className='systemChatMessage'>Welcome to the public chat room, please be pleasant!</li>],
      playersInRoom: 0
    }
  }

  componentDidMount(){
    this.props.socket.on('updateChat', function(username,chatMessage){
      this.UpdateChat(username, chatMessage)
    }.bind(this))
  }
  componentWillUnmount(){
    this.props.socket.off('updateChat');
  }

  submitChatMessage(event){
    event.preventDefault();
    let chatMessage = document.getElementById('chatInput').value.trim();
    if(chatMessage === ''){
      return;
    }
    this.UpdateChat(this.props.username, chatMessage)
    document.getElementById('chatInput').value = ""
    this.props.socket.emit('sendChatMessage',this.props.username, chatMessage, this.props.roomName)
  }

  UpdateChat(username,chatMessage){
    this.setState({
      chatMessage: this.state.chatMessages.push(
        <li>
          <span className="chatUsername">{username}:</span>
          <span className="chatMessage">{chatMessage}</span>
        </li>
      )
    }, () =>{
      // Scroll chat to bottom
      var chat = document.getElementById("chatMessages");
      chat.scrollTop = chat.scrollHeight;
    })

  }

  render(){
    return(  
      <div className="chatbox">
        <ul id="chatMessages">
          {this.state.chatMessages}
        </ul>
        <form onSubmit={this.submitChatMessage.bind(this)}>
          <input id="chatInput" autocomplete="off" />
          <button>Send</button>
        </form>
      </div>
    )
  }
}

export default ChatBox;