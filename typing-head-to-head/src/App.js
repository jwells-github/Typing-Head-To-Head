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
    const wordList = [];
    for(var i = 0; i < this.state.words.length; i++){
      let itemClass = "word "
      if(i < this.state.currentPosition ){
        itemClass += "completedWord"
      }
      else if(i === this.state.currentPosition ){
        itemClass += "currentWord"
      }
      wordList.push(<li className={itemClass} key={i}>{this.state.words[i]}</li>)
    }
    return (
      <div className="App">
        <div>
          <ul>
            {wordList}
          </ul>
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
