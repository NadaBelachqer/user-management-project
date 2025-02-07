import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTables';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import UserForm from './components/UserForm';  
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const endpoint = searchQuery ? `/users/search?query=${searchQuery}` : '/users';
            try {
                const response = await axios.get(`http://localhost:5000${endpoint}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchUsers();
    }, [searchQuery]);

    const addUser = (user) => {
        setUsers(prevUsers => [...prevUsers, user]);
    };

    const editUser = (updatedUserId, updatedUserData) => {
        axios.put(`http://localhost:5000/users/${updatedUserId}`, updatedUserData)
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUserId ? { ...user, ...updatedUserData } : user
                    )
                );
            })
            .catch((error) => console.error('Error updating user:', error));
    };

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:5000/users/${userId}`)
            .then(() => {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            })
            .catch((error) => console.error('Error deleting user:', error));
    };

    return (
        <div>
            <Header />
            <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                addUser={addUser} 
                buttonText={showForm ? "Close" : "Add User"} 
                setShowForm={setShowForm}  
            />
            {showForm && <UserForm addUser={addUser} />} 
            <UserTable users={users} editUser={editUser} deleteUser={deleteUser} />
        </div>
    );
}

export default App;
