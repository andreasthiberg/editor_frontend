import { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import Toolbar from './toolbar.js';


export default function Editor() {

    const [editorContent, setEditorContent] = useState([""]);

    function handleChange (text,html) {
      setEditorContent(html);
    };

    const docs = ["Hej"];
    
    return (
        <div className="editor">
          <Toolbar editorContent={editorContent} />
          <TrixEditor onChange={handleChange}  />
          <select>
            <option value="-99" key="0">Choose a document</option>
            {docs.map((doc, index) => <option value={index} key={index}>{doc.name}</option>)}
          </select>
        </div>
        
      );
  }