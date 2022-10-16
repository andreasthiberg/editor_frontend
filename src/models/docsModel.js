
const config = require("../config/config.json")
let URL; 
if (config.devMode === "true"){
    URL ="http://" + config.localDB;
} else {
    URL = "https://" + config.deployedDB;
}


const docs = {

    getDocs: async function getDocs(token) {

        const graphqlQuery = {
            "query": `{ documents { _id name content owner allowed_users mode comments { row content } } }`,
        };

        const response = await fetch(`${URL}/graphql/`,{
            method: "POST",
            headers: {
                "x-access-token": token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        });
        const result = await response.json();
        return result;
    },

    createDoc: async function createDoc(docName,docContent,owner,mode,token) {
        const response = await fetch(`${URL}/docs/create`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                name: docName,
                content: docContent,
                owner: owner,
                mode: mode
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
        const result = await response.json();
        console.log(result);
        return result[0];
    },

    removeAll: async function removeAll(token){
        await fetch(`${URL}/docs/remove-all`,{
            headers: {
                "x-access-token": token
            }
        });
    },

    saveDocument: async function saveDocument(doc, token){
        await fetch(`${URL}/docs/save`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                _id: doc._id,
                name: doc.name,
                content: doc.content
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
        return;
    },

    addComment: async function addComment(docId, row, comment, token){
        const result = await fetch(`${URL}/docs/addcomment`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                id: docId,
                row: row,
                comment: comment
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
        return result;
    }
};

export default docs;