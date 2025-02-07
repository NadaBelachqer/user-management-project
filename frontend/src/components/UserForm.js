import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ addUser }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { firstName, lastName, email, city } = formData;
    
        if (!firstName || !lastName || !email || !city) {
            setError('Veuillez remplir tous les champs.');
            setSuccessMessage('');
            return;
        }
    
        if (!validateEmail(email)) {
            setError('Veuillez entrer un email valide.');
            setSuccessMessage('');
            return;
        }
    
        setError('');
    
        try {
            const response = await axios.post('http://localhost:5000/users', formData);
            addUser(response.data);  
    
            setSuccessMessage('Utilisateur ajouté avec succès !');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                city: '',
            });
    
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            setSuccessMessage('');
        }
    };

    console.log('Form rendered');  

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="mb-4 text-center">Add User</h2>

                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="Fisrt Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Add User</button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
