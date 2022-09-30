import React, { useState} from 'react';
import authModel from '../models/authModel';

export default function registerForm() {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");

    async function handleSubmit(){
        if(email.length > 0 && password.length > 0){
            const result = await authModel.registerUser(email,password)
            setEmail("");
            setPassword("");
            setRegisterMessage(result.registerMessage);
        }
    }


    return (
        <div className="register-form">
            <h3>Registrera ny användare</h3>
            E-mail<br />
            <input className="login-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            Lösenord<br />
            <input className="login-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={handleSubmit}>Registrera</button>
            {registerMessage}
        </div>
      );

    
}