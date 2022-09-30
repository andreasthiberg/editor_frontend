import React, {useState} from 'react';
import Editor from "./components/editor";
import RegisterForm from "./components/registerForm";
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

    return (<div className='page-container'>
      <header>
        <h1 className="page-title">Textredigerare i React.</h1>
      </header>
      <Editor jwt={jwt} userEmail={userEmail} loggedIn={loggedIn}/>
      { jwt === "" ? 
        <div className="user-form">
        <RegisterForm />
        <LoginForm setJwt={setJwt} setLoggedIn={setLoggedIn} setUserEmail={setUserEmail}/>
        </div>
        : <div className="user-form">Inloggad som {userEmail}</div> 
      }
      { jwt !== "" ? 
        <LogoutButton setLoggedIn={setLoggedIn} setJwt={setJwt} setUserEmail={setUserEmail}/> : null
      }
      <DevBox />
      </div>
    );
}

