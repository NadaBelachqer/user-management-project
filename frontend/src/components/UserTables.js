import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const UserTable = ({ users, deleteUser, editUser }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        city: ''
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            city: user.city
        });
        setMessage('');
        console.log(`✏️ Editing user ID ${user.id}`);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        console.log('Updating user ID:', editingUser.id);
        
        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${editingUser.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 200) {
                editUser(editingUser.id, formData);
                setEditingUser(null);
                setMessage('✅ User updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/users/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 200) {
                deleteUser(id);
                setMessage('🗑️ User deleted successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Delete error:', error.response?.data || error.message);
            setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="container mt-5">
            <style>
                {`
                    .icon-button {
                        background-color: transparent; 
                        border: none; 
                        cursor: pointer;
                        font-size: 20px; 
                    }

                    .icon-button:hover {
                        opacity: 0.7;
                    }

                    .icon-button:first-child {
                        color: #FFA523; 
                    }

                    .icon-button:last-child {
                        color: #715ec5; 
                    }

                    .table td, .table th {
                        vertical-align: middle;
                    }

                    .form-group {
                        margin-bottom: 15px;
                    }

                    .form-control {
                        width: 100%;
                        padding: 8px;
                        margin: 5px 0;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    .form-button {
                        padding: 10px 15px;
                        background-color: #FFA523;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }

                    .form-button:hover {
                        background-color: #e9940f;
                    }

                    .message {
                        padding: 10px;
                        margin-bottom: 15px;
                        border-radius: 5px;
                        font-weight: bold;
                    }

                    .message.success {
                        background-color: #d4edda;
                        color: #155724;
                    }

                    .message.error {
                        background-color: #f8d7da;
                        color: #721c24;
                    }
                `}
            </style>

            {message && (
                <div className={`message ${message.includes('✅') || message.includes('🗑️') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {editingUser && (
                <div className="mb-4">
                    <h3>Modifier l'utilisateur</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="firstname">Prénom</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className="form-control"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Nom</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                className="form-control"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ville</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-control"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="form-button">Update</button>
                    </form>
                </div>
            )}

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Ville</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                            <td>
                                <button onClick={() => handleEdit(user)} className="icon-button mr-3">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="icon-button">
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
