import React, {Component} from 'react'

class ChatBox extends Component {

  componentDidUpdate(){
    var chat = document.getElementById("chatMessages");
    chat.scrollTop = chat.scrollHeight;
  }

  submitChatMessage(event){
    event.preventDefault();
    let chatMessage = document.getElementById('chatInput').value.trim();
    if(chatMessage === ''){
      return;
    }
    this.props.updateChat(this.props.username,chatMessage)
    document.getElementById('chatInput').value = ""
    this.props.socket.emit('sendChatMessage',this.props.username, chatMessage, this.props.roomName)
  }
  
  render(){
    return(  
      <div className="chatbox">
        <ul id="chatMessages">
          <li className='systemChatMessage'>Welcome to the chat room, please be pleasant!</li>
          {this.props.chatMessages}
        </ul>
        <form onSubmit={this.submitChatMessage.bind(this)}>
          <input id="chatInput" autoComplete="off" />
          <button>Send</button>
        </form>
      </div>
    )
  }
}

export default ChatBox;