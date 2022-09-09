const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`http://localhost:1337/docs`);
        const result = await response.json();
        return result;
    },
    createDoc: async function createDoc(docName,docContent) {
        const response = await fetch("http://localhost:1337/create", {
     
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
        await fetch(`http://localhost:1337/remove-all`);
    },
    saveDocument: async function saveDocument(doc){
        await fetch("http://localhost:1337/save", {
     
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
    }, 
};

export default docs;