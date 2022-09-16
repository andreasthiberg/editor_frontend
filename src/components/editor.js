import { useState, useEffect} from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import Toolbar from './toolbar.js';
import docsModel from '../models/docsModel';


export default function Editor() {

    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({name:"",content:""});
    const [editor, setEditor] = useState();
    const [currentDocName, setCurrentDocName] = useState("");

    useEffect(() => {
          (async () => {
              const allDocs = await docsModel.getAllDocs();
              setDocs(allDocs);
          })();
          
      }, [currentDoc]);

      useEffect(() => {
        (async () => {
          console.log("Hej");
          if(typeof editor != "undefined"){
            editor.setSelectedRange([0,1000]);    
            editor.insertString(currentDoc.content);
          }
        })();
        
    }, [currentDocName])

    function handleChange (text,html) {
      let changedDocument = {...currentDoc};
      if(changedDocument.hasOwnProperty('_id')){
        changedDocument.content = html;
        setCurrentDoc(changedDocument);
      }
    };

    /* Add a new document to database with title and content. Refresh list of documents */
    async function newDocument(newName){
      const newDoc = await docsModel.createDoc(newName,"");
      await refreshDocList();
      setCurrentDoc(newDoc);
      setCurrentDocName(newDoc.name);
    }

    function saveDocument(){
      docsModel.saveDocument(currentDoc);
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
    }

    function pickDoc(event){
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
          <div>Nuvarande dokument: {currentDocName}</div>
          <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady}  />
          <select data-testid="selection" onChange={pickDoc}>
          <option value="-99" key="0">Choose a document</option>
          {docs.map((doc, index) => <option value={doc._id} key={index}>{doc.name}</option>)}
          </select>
        </div>
      );
  }