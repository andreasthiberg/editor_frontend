import React, { useState} from 'react';
import authModel from '../models/authModel';

export default function linkRegisterForm(props) {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");

    //Attempt to register user if fields are filled in
    async function handleSubmit(){
        if(email.length > 0 && password.length > 0){
            const result = await authModel.registerUser(email,password)
            setEmail("");
            setPassword("");
            setRegisterMessage(result.registerMessage);
            if(result.registerMessage === "Registrerad!"){
                let response = await authModel.login(email,password)
                if("token" in response){
                    props.setUserEmail(email);
                    props.setJwt(response.token);
                    props.setLoggedIn(true);
                    props.setRegisterLink(false);
                    await authModel.addUserToDocument(props.inviteDocumentId,email,response.token)
                }
            }
        }
    }

    return (
        <div className="register-form">
            <h3>Du har blivit inbjuden att redigera dokumentet "{props.inviteDocumentName}". Registrera dig nedan för att få åtkomst.</h3>
            E-mail<br />
            <input data-testid="register-email" className="login-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            Lösenord<br />
            <input className="login-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={handleSubmit}>Registrera</button>
            {registerMessage}
        </div>
      );

    
}
