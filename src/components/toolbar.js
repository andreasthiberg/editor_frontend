import React, { useState }  from 'react';

export default function Toolbar(props) {

    const [newTitle,setNewTitle] = useState("");

    const handleTitleChange = event => {
      setNewTitle(event.target.value);
    }

    const handleNewDocument = () => {
      if(newTitle !== ""){
        props.newDocument(newTitle);
      }
    }

    return (
        <div className="toolbar">
          <button className="save-button" onClick={props.saveDocument}>
              Spara
          </button>
          <button className="save-button" onClick={props.removeAllDocuments}>
              Ta bort alla dokument
          </button>
          <form>
              Namn på nytt dokument:
              <input data-testid="name-input" type="text" name="name" onChange={handleTitleChange}/>
          </form>
          <button data-testid="new-document" onClick={handleNewDocument}>Skapa nytt dokument</button>
        </div>
        
      );
  }
