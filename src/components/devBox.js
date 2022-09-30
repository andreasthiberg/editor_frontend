import React, { useEffect, useState} from 'react';
import authModel from '../models/authModel';

export default function devBox() {

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        refreshUserList();
    },[]);

    async function refreshUserList(){
        const resultSet = await authModel.getAllUsers();
        setAllUsers(resultSet.users);
    }

    return (
        <div className="dev-box">
            <br/>
            <h3>Development/testing info</h3>
            Current users (default password: 123)<br/>
            {allUsers.map((user, index) => <div key={index}>{user.email}</div>)}
        </div>
      );

    
}
