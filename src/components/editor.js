import React, { useState, useEffect} from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import Toolbar from './toolbar.js';
import docsModel from '../models/docsModel';
import io from "socket.io-client";


export default function Editor() {

    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({name:"",content:"",_id:""});
    const [editor, setEditor] = useState();
    const [currentDocName, setCurrentDocName] = useState("");

    
    // Socket.io

    let socket;

    useEffect(() => {

      /*Connect socket */
      socket = io("http://localhost:1337");

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

    async function handleChange (text,html) {
      let changedDocument = {...currentDoc};
      if(changedDocument.hasOwnProperty('_id')){
        changedDocument.content = html;
        setCurrentDoc(changedDocument);
      }
    };

    /* Add a new document to database with title and content. Refresh list of documents */
    async function newDocument(newName){
      const newDoc = await docsModel.createDoc(newName,"");
      setCurrentDoc(newDoc);
      setCurrentDocName(newDoc.name);
      refreshDocList();
    }

    async function saveDocument(){

      if(currentDoc["_id"] !== ""){
        docsModel.saveDocument(currentDoc);
        refreshDocList();
      }
    }

    function removeAllDocuments(){
      docsModel.removeAll();
      refreshDocList();
    }

    async function refreshDocList(){
      const allDocs = await docsModel.getAllDocs();
      setDocs(allDocs);
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
    
    return (
        <div className="editor">
          <Toolbar editorContent={"hej"} newDocument={newDocument} 
          removeAllDocuments={removeAllDocuments} saveDocument={saveDocument}/>
          <div><h3 data-testid="document-title">Nuvarande dokument: {currentDocName}</h3></div>
          <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady}  />
          <select data-testid="selection" onChange={pickDoc}>
          <option value="-99" key="0">Choose a document</option>
          {docs.map((doc, index) => <option value={doc._id} key={index}>{doc.name}</option>)}
          </select>
        </div>
      );
  }