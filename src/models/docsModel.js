
const localDev = true;
let URL; 
if (localDev){
    URL = "http://localhost:1337";
} else {
    URL = "https://jsramverk-editor-anth21.azurewebsites.net";
}


const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${URL}/docs`);
        const result = await response.json();
        return result;
    },
    createDoc: async function createDoc(docName,docContent) {
        const response = await fetch(`${URL}/create`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                name: docName,
                content: docContent
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const result = await response.json();
        return result[0];
    },
    removeAll: async function removeAll(){
        await fetch(`${URL}/remove-all`);
    },
    saveDocument: async function saveDocument(doc){
        await fetch(`${URL}/save`, {
     
            method: "POST",
             
            // Adding body or contents to send
            body: JSON.stringify({
                _id: doc._id,
                name: doc.name,
                content: doc.content
            }),
             
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        return;
    }, 
};

export default docs;