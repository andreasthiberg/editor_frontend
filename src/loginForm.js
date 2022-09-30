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
                console.log(response.token)
            }
            setEmail("");
            setPassword("");
            setLoginMessage(response.loginMessage);
        }
    }


    return (
        <div className="login-form">
            Logga in
            E-mail
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            Lösenord
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>Logga in</button>
            {loginMessage}
        </div>
      );

    
}
