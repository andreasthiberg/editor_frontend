import React, { useEffect, useState} from 'react';
import authModel from '../models/authModel';
import emailModel from '../models/emailModel';

export default function addUserForm(props) {

    const [allUsers, setAllUsers] = useState([]);
    const [newUser,setNewUser] = useState("");
    const [docId,setDocId] = useState("");
    const [addUserMessage,setAddUserMessage] = useState("");
    const [email,setEmail] = useState("");

    useEffect(() => {
        refreshUserList();
    },[]);

    async function handleSubmit(){
        if(docId !== "" && newUser !== ""){
            authModel.addUserToDocument(docId,newUser,props.jwt);
            setAddUserMessage("Användare tillagd.")
        } else {
            setAddUserMessage("Välj dokument/användare.")
        }
    }

    async function handleInputEmail(e){
        setEmail(e.target.value)
    }

    async function handleSubmitEmail(){
        emailModel.sendEmail("Hallå",12,props.jwt)
    }

    async function refreshUserList(){
        const resultSet = await authModel.getAllUsers();
        setAllUsers(resultSet.users);
    }

    async function selectDoc(event){
        setDocId(event.target.value);
    }

    async function selectUser(event){
        setNewUser(event.target.value);
    }

    return (
        <div>
            <div className="add-user-form">
            Ge användare rätt till ett dokument<br/>
            <select onChange={selectUser}>
            <option value="-99" key="0">Välj en användare</option>
            {allUsers.map((user, index) => <option value={user.email} key={index}>{user.email}</option>)}
            </select><br/>
            <select onChange={selectDoc}>
            <option value="-99" key="0">Välj ett dokument</option>
            {props.docs.map((doc, index) => <option value={doc._id} key={index}>{doc.name}</option>)}
            </select><br/>
            <button onClick={handleSubmit}>Lägg till</button>
            {addUserMessage}<br/><br/>
            </div>
            <div className="add-user-form">
            Bjud någon för att redigera det valda dokumentet<br/>
            Email:<input type="text" value={email} onChange={handleInputEmail}></input>
            <button onClick={handleSubmitEmail}>Skicka email</button>
            </div>
        </div>
      );

    
}
