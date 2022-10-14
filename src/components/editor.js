import React, { useState, useEffect} from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import Toolbar from './toolbar.js';
import docsModel from '../models/docsModel';
import io from "socket.io-client";
import AddUserForm from './addUserForm.js';
import AddCommentForm from './addCommentForm.js';
import CommentDisplay from './commentDisplay.js';
import { jsPDF } from "jspdf";

const config = require("../config/config.json")
let URL; 
if (config.devMode === "true"){
    URL = config.localDB;
} else {
    URL = config.deployedDB;
}


export default function Editor(props) {

  const [docs, setDocs] = useState([]);
  const [currentDoc, setCurrentDoc] = useState({name:"",content:"",_id:"",comments:[]});
  const [editor, setEditor] = useState();
  const [currentDocName, setCurrentDocName] = useState("Inget dokument valt.");
  const [newComment,setNewComment] = useState("");
  const [showCommentForm,setShowCommentForm] = useState(false);
  const [currentRow,setCurrentRow] = useState("");
  
  // Socket.io setup
  let socket;
  useEffect(() => {
    /* Connect socket */
    socket = io(`ws://${URL}/`);

    /* Send current document */
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
  
  //Change editor content on doc change
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
        setCurrentDoc({name:"",content:"",_id:"",comments:[]});
        setCurrentDocName("Inget dokument valt");
      }
    })();
    
}, [props.loggedIn])

  //Get docs when logged in
  useEffect(() => {
    refreshDocList();
  },[props.jwt])

  


  //Changes doc content when typing in editor
  async function handleChange (text,html) {
    let changedDocument = {...currentDoc};
    if(changedDocument.hasOwnProperty('_id')){
      changedDocument.content = html;
      setCurrentDoc(changedDocument);
    }
  };

  /* Add a new document to database with title and content. Refresh list of documents */
  async function newDocument(newName){
    const newDoc = await docsModel.createDoc(newName,"",props.userEmail,props.jwt);
    if("name" in newDoc){
      setCurrentDoc(newDoc);
      setCurrentDocName(newDoc.name);
      refreshDocList();
    }
  }

  //Save document content to database
  async function saveDocument(){
    if(currentDoc["_id"] !== ""){
      docsModel.saveDocument(currentDoc,props.jwt);
      refreshDocList();
    }
  }

  //Deletes all documents from database. Remove in finished version!
  function removeAllDocuments(){
    docsModel.removeAll(props.jwt);
    refreshDocList();
  }

  //Refresh list (and content) of documents from database
  async function refreshDocList(){
    const resultSet = await docsModel.getDocs(props.jwt);
    if ("data" in resultSet){
      const allDocs = resultSet.data.documents
      let allowedDocs = [];
      for(let index in allDocs){
        if(allDocs[index].allowed_users.includes(props.userEmail)){
            allowedDocs.push({...allDocs[index]})
        }
      setDocs(allowedDocs);
    }
    }
  }

  //Handle editor on page load, load initial documents
  function handleEditorReady(e) {
    setEditor(e);
    refreshDocList();
  }

  //Change doc when user selects from list
  async function pickDoc(event){
    let choosenDocument = docs.find(doc => {
      return doc._id === event.target.value;
    })
    setCurrentDoc(choosenDocument);
    setCurrentDocName(choosenDocument.name)
  };

  //Create PDF
  function createPdf(){
    if(currentDoc.name==="Inget dokument valt."){
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    const title = currentDoc.name;
    const content = currentDoc.content;
    let contentWithBreaks = content.replace(/(.{90})/g,"$1\n")
    let finishedDoc = title+"\n\n\n"+contentWithBreaks;
    doc.text(finishedDoc,15,30)
    doc.save(currentDoc.name + ".pdf");
  }

  //Adds a comment based on the currently selected row in the document, and the input
  // in the comment form. 
  async function addComment(){
    const currentRow = getCurrentRow()
    await docsModel.addComment(currentDoc._id,currentRow,newComment,props.jwt)
    let newCurrentDoc = ({...currentDoc});
    let oldComments = [...currentDoc.comments]
    oldComments.push({row: currentRow, content: newComment});
    newCurrentDoc.comments = oldComments;
    setCurrentDoc(newCurrentDoc);
    setNewComment("");
    setShowCommentForm(false);
  }
  
  //Get the row where the user is currently selecting. If empty content return 0 (First row).
  function getCurrentRow(){
    const currentContent = currentDoc.content;
    const currentSelectionStart = editor.getSelectedRange()[0];
    const contentBeforeSelection = currentContent.substring(0,currentSelectionStart);

    if (contentBeforeSelection !== ""){
      const re = /\n/g
      let rowCount = ((contentBeforeSelection || '').match(re) || []).length
      return rowCount;
    }
    return 0;
  }

  function displayCommentForm(){
    setShowCommentForm(true);
    setCurrentRow(getCurrentRow());
  }

  //Component only renders if user is logged in!
  if(props.jwt !== ""){
    return (
      <div className="editor">
        <Toolbar newDocument={newDocument} 
        removeAllDocuments={removeAllDocuments} saveDocument={saveDocument} createPdf={createPdf}/>
        <div><h3 data-testid="document-title">Nuvarande dokument: {currentDocName}</h3></div>
        <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady}  />
        {currentDoc.name !== "" &&
        <button onClick={displayCommentForm}>Lägg till kommentar på vald rad</button>
        }
        <br/>
        <select className="doc-select" data-testid="selection" onChange={pickDoc}>
        <option value="-99" key="0">Välj ett dokument</option>
        {docs.map((doc, index) => <option value={doc._id} key={index}>{doc.name}</option>)}
        </select>
        <div className="option-boxes">
        <AddUserForm currentDoc={currentDoc} docs={docs} jwt={props.jwt}/>
        {currentDoc.comments.length > 0 &&
        <CommentDisplay currentDoc={currentDoc}/>
        }
        {showCommentForm &&
        <AddCommentForm setShowCommentForm={setShowCommentForm} 
        currentRow={currentRow} addComment={addComment} newComment={newComment} 
        setNewComment={setNewComment}/>
        }

        </div>
      </div>
    );
  } else {
    return null
  }

}
