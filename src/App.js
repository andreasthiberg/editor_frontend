import React, {useEffect, useState} from 'react';
import Editor from "./components/editor";
import RegisterForm from "./components/registerForm";
import LinkRegisterForm from "./components/linkRegisterForm";
import LoginForm from './components/loginForm';
import LogoutButton from './components/logoutButton';
import DevBox from './components/devBox';
import "trix";
import "trix/dist/trix.css";
import './App.css';

export default function App() {
    const [jwt,setJwt] = useState("");
    const [loggedIn,setLoggedIn] = useState(false);
    const [userEmail,setUserEmail] = useState("");
    const [registerLink,setRegisterLink] = useState(false);
    const [inviteDocumentId,setInviteDocumentId] = useState("");
    const [inviteDocumentName,setInviteDocumentName] = useState("");

    //Set document ID for register link
    const queryParams = new URLSearchParams(window.location.search);
    const regId = queryParams.get('regId');
    const regName = queryParams.get('name');
  

    useEffect(() => {
      if(regId !== null){
        setInviteDocumentId(regId);
        setInviteDocumentName(regName);
        setRegisterLink(true);
      }
    },[])

    return (<div className='page-container'>
      <header>
        <h1 className="page-title">Textredigerare i React.</h1>
      </header>


      <Editor jwt={jwt} userEmail={userEmail} loggedIn={loggedIn}/> 
      { registerLink ?
        <LinkRegisterForm inviteDocumentId={inviteDocumentId} setJwt={setJwt}
        setLoggedIn={setLoggedIn} setUserEmail={setUserEmail} setRegisterLink={setRegisterLink}
        inviteDocumentName={inviteDocumentName} /> : null
      } 
      { jwt === "" && !registerLink ? 
        <div className="user-form">
        <RegisterForm />
        <LoginForm setJwt={setJwt} setLoggedIn={setLoggedIn} setUserEmail={setUserEmail}/>
        </div>
        : null
      }
      { jwt !== "" ? 
        <div>
        <div className="user-form">Inloggad som {userEmail}</div> 
        <LogoutButton setLoggedIn={setLoggedIn} setJwt={setJwt} setUserEmail={setUserEmail}/> </div>
        : null
      }
      <DevBox />
      </div>
    );
}

