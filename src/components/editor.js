import React, { useState, useEffect} from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import Toolbar from './toolbar.js';
import docsModel from '../models/docsModel';
import io from "socket.io-client";
import AddUserForm from './addUserForm.js';


export default function Editor(props) {

  const [docs, setDocs] = useState([]);
  const [currentDoc, setCurrentDoc] = useState({name:"",content:"",_id:""});
  const [editor, setEditor] = useState();
  const [currentDocName, setCurrentDocName] = useState("Inget dokument valt.");
  
  // Socket.io
  let socket;
  useEffect(() => {
    /*Connect socket */
    socket = io("ws://jsramverk-editor-anth21.azurewebsites.net/");
    /*Sent current document */
    socket.emit("doc",currentDoc);
    socket.on("save", (doc)=> {
      saveDocument();
    })
    /* React to update from other user working on same doc */
    socket.on("update", (doc)=> {
      if(doc["content"] !== currentDoc["content"]){
        editor.setSelectedRange([0,1000]);    
        editor.insertString(doc.content);
      }
    })
    /* Update full doclist whenever changes are made elsewhere */
    socket.on("change", (doc)=> {
      if(doc["_id"] !== currentDoc["_id"]){
        refreshDocList();
      }
    });
    /* Disconnect when done */
    return () => {
      socket.disconnect()
    }
  },[currentDoc]);
  
  useEffect(() => {
      (async () => {
        if(typeof editor != "undefined"){
          editor.setSelectedRange([0,1000]);    
          editor.insertString(currentDoc.content);
        }
      })();
      
  }, [currentDocName])


  // Reset states when logged out
  useEffect(() => {
    (async () => {
      if(!props.loggedIn){
        setCurrentDoc({name:"",content:"",_id:""});
        setCurrentDocName("Inget dokument valt");
      }
    })();
    
}, [props.loggedIn])


  useEffect(() => {
    refreshDocList();
  },[props.jwt])

  async function handleChange (text,html) {
    let changedDocument = {...currentDoc};
    if(changedDocument.hasOwnProperty('_id')){
      changedDocument.content = html;
      setCurrentDoc(changedDocument);
    }
  };

  useEffect(() => {
    refreshDocList();
  },[props.jwt])

  /* Add a new document to database with title and content. Refresh list of documents */
  async function newDocument(newName){
    const newDoc = await docsModel.createDoc(newName,"",props.userEmail,props.jwt);
    if("name" in newDoc){
      setCurrentDoc(newDoc);
      setCurrentDocName(newDoc.name);
      refreshDocList();
    }
  }
  async function saveDocument(){
    if(currentDoc["_id"] !== ""){
      docsModel.saveDocument(currentDoc,props.jwt);
      refreshDocList();
    }
  }
  function removeAllDocuments(){
    docsModel.removeAll(props.jwt);
    refreshDocList();
  }

  async function refreshDocList(){
    const resultSet = await docsModel.getUserDocs(props.jwt);
    if ("docs" in resultSet){
      let allDocs = resultSet.docs;
      let allowedDocs = [];
      for(let index in allDocs){
        if(allDocs[index].allowed_users.includes(props.userEmail)){
            allowedDocs.push({...allDocs[index]})
        }
      setDocs(allowedDocs);
    }
    }
  }

  function handleEditorReady(e) {
    setEditor(e);
    refreshDocList();
  }
  async function pickDoc(event){
    let choosenDocument = docs.find(doc => {
      return doc._id === event.target.value;
    })
    setCurrentDoc(choosenDocument);
    setCurrentDocName(choosenDocument.name)
  };
  
  if(props.jwt !== ""){
    return (
      <div className="editor">
        <Toolbar newDocument={newDocument} 
        removeAllDocuments={removeAllDocuments} saveDocument={saveDocument}/>
        <div><h3 data-testid="document-title">Nuvarande dokument: {currentDocName}</h3></div>
        <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady}  />
        <select className="doc-select" data-testid="selection" onChange={pickDoc}>
        <option value="-99" key="0">Välj ett dokument</option>
        {docs.map((doc, index) => <option value={doc._id} key={index}>{doc.name}</option>)}
        </select>
        <AddUserForm className="add-user-form" docs={docs} jwt={props.jwt}/>
      </div>
    );
  } else {
    return (
      <div>Välkommen! Logga in nedan för att komma till text-redigeraren.</div>
    )
  }

}
