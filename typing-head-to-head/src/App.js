import React, {Component} from 'react'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: ["The","big","dog","named","Dave","ate","sausages!"],
      currentPosition : 0
    } 
  }

  compareInput(event){
    let input = event.target.value
    let inputChar = input.substring(event.target.value.length-1,input.length)
    let currentWord = this.state.words[this.state.currentPosition]

    if(inputChar === " "){
      if(input.substring(0,input.length-1) === this.state.words[this.state.currentPosition]){
        this.setState({currentPosition: this.state.currentPosition +1})
        event.target.value = ""
        event.target.style.background = "white"
        return
      }
    }
    if (currentWord.substring(0,input.length) !== input){
      event.target.style.background = "red"
    }
    else{
      event.target.style.background = "white"
    }
  }
  
  render(){
    return (
      <div className="App">
        <div>
          <h1>{this.state.words[this.state.currentPosition]}</h1>
        </div>
        <div>
          <input onInput={this.compareInput.bind(this)}></input>
        </div>
      </div>
    )
  }
}

export default App;
