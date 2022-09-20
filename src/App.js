import React from 'react';
import Editor from "./components/editor";
import "trix";
import "trix/dist/trix.css";
import './App.css';

export default function App() {
  

    return (<div>
      <header>
        <h1 className="page-title">Custom editor in React.</h1>
      </header>
      <Editor />
      </div>
    );
}

