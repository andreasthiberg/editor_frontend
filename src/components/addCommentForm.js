import React from 'react';

export default function addCommentForm(props) {



    async function handleSubmit(){
        if(props.newComment !== ""){
            props.addComment();
        }
    }


    async function handleSubmitCancel(){
        props.setShowCommentForm(false);
    }


    function handleInput(e){
        props.setNewComment(e.target.value);
    }


    return (
        <div className="add-comment-form">
            Lägg till kommentar på rad {props.currentRow + 1}
            <br/>
            <input type="text" value={props.newComment} onChange={handleInput}></input>
            <button onClick={handleSubmit}>Lägg till</button>
            <button onClick={handleSubmitCancel}>Avbryt</button>
        </div>
      );

}
