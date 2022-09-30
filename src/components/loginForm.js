import React, { useState} from 'react';
import authModel from '../models/authModel';

export default function loginForm(props) {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    async function handleSubmit(){
        if(email.length > 0 && password.length > 0){
            let response = await authModel.login(email,password)
            if("token" in response){
                props.setUserEmail(email);
                props.setJwt(response.token);
                props.setLoggedIn(true);
            }
            setEmail("");
            setPassword("");
            setLoginMessage(response.loginMessage);
        }
    }


    return (
        <div className="login-form">
            <h3>Logga in</h3>
            E-mail<br />
            <input required className="login-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            Lösenord<br />
            <input required className="login-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={handleSubmit}>Logga in</button>
            {loginMessage}
        </div>
      );

    
}
