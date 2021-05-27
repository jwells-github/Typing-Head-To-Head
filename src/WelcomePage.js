import React, {Component} from 'react'

class WelcomePage extends Component {

  setUsername(event){
    event.preventDefault();
    let usernameInput = document.getElementById("username").value.trim();
    if(usernameInput === ""){
      return;
    }
    this.props.storeUsername(usernameInput)
    this.props.socket.emit("setUsername", usernameInput);
  }

  render(){
    return(  
    <div id="welcomePage">
      <h1>Typing Head-To-Head</h1>
      <p>Typing Head-To-Head is a game that can be played solo or against an opponent. Players are given a passage of text and are challenged to type it as quickly as possible</p>
      <p>Enter a username to play!</p>
      <div>
        <form onSubmit={this.setUsername.bind(this)}>
          <input id='username' placeholder="Your username"></input>
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
    )
  }
}

export default WelcomePage;