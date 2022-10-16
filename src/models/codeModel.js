
let URL = "https://execjs.emilfolino.se/code"

const code = {
    sendCode: async function sendCode(code) {
        const b64code = btoa(code);
        const response = await fetch(URL, {
     
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({ 
                code: b64code
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json"
            }
        });
        const result = await response.json();
        let decodedOutput = atob(result.data);
        return decodedOutput;
    }
};

export default code;