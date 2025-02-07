import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import axios from 'axios';

const UserTable = ({ users, deleteUser, editUser }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: ''
    });

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
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            city: user.city
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const updatedUser = {
                ...formData
            };

            const response = await axios.put(`http://localhost:5000/users/${editingUser.id}`, updatedUser);

            if (response.status === 200) {
                editUser(editingUser.id, updatedUser);
                setEditingUser(null); 
            } else {
                console.error("Erreur lors de la mise à jour de l'utilisateur");
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            deleteUser(id); 
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
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
                        opacity: 0.7; /* Effet au survol */
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
                        background-color: #FFA523;
                    }
                `}
            </style>

            {editingUser && (
                <div className="mb-4">
                    <h3>Modifier l'utilisateur</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="firstName">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
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
                        <button type="submit" className="form-button">Mettre à jour</button>
                    </form>
                </div>
            )}

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fisrt Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="icon-button mr-3"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="icon-button"
                                >
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
