
const config = require("../config/config.json")
let URL; 
if (config.devMode === "true"){
    URL ="http://" + config.localDB;
} else {
    URL = "https://" + config.deployedDB;
}


const auth = {
    registerUser: async function registerUser(email,password) {
        const response = await fetch(`${URL}/auth/register`, {
     
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({ 
                email: email,
                password: password
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const result = await response.json();
        return result;
    },
    login: async function login(email,password){
        const response = await fetch(`${URL}/auth/login`, {
     
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({ 
                email: email,
                password: password
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });
        const result = await response.json();
        return result;
    },
    addUserToDocument: async function addUserToDocument(docId,user,token){
        const response = await fetch(`${URL}/docs/adduser`, {
     
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({ 
                user: user,
                id: docId
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
        return response;
    },
    getAllUsers: async function getAllUsers(){
        const response = await fetch(`${URL}/auth/users`);
        const result = await response.json();
        return result;
    }
};

export default auth;