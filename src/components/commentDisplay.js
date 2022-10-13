import React from 'react';

//Component used to display comments added to current document
export default function commentDisplay(props) {

    return (
        <div className="comment-display">
            <b className="comment-title">Kommentarer</b>
            {props.currentDoc.comments.map((comment, index) => <div className={"comment-row-"+index} key={index}>Rad {comment.row + 1} - {comment.content}</div>)}
        </div>
      );

    
}
