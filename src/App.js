import React, { Component } from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import './App.css';


class App extends Component {
  render () {
    return (<div>
      <header>
        <h1 className="page-title">Custom editor in React.</h1>
      </header>
      <Editor />
      </div>
    );
  }
}

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {editorContent: ""}
  }

  handleChange = (text,html) => {
    this.setState({editorContent: html})
  }
  
  render() {

    return (
      <div className="editor">
        <Toolbar editorContent={this.state.editorContent} />
        <TrixEditor onChange={this.handleChange}  />
      </div>
    );
    
  }
}

class Toolbar extends Component {

  saveButton = () => {
    console.log(this.props.editorContent);
  };

  render(){
    return (
      <div className="toolbar">
        <button className="save-button" onClick={this.saveButton}>
            Spara
        </button>
      </div>
    );
  }
}

export default App;
