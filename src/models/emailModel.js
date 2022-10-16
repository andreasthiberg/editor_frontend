
const config = require("../config/config.json")
let URL; 
if (config.devMode === "true"){
    URL ="http://" + config.localDB;
} else {
    URL = "https://" + config.deployedDB;
}


const email = {
    sendEmail: async function sendEmail(email,docId,docName,token) {
        const response = await fetch(`${URL}/email/send`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                email: email,
                id: docId,
                name: docName
            }),
             
            // Adding headers to the requestxw
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
        const result = await response.json();
        console.log(result);
        return result;
    }
};

export default email;