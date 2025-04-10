import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ addUser, onClose }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        city: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!Object.values(formData).every(Boolean)) {
            setError('All fields are required');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/users', formData);
            addUser(res.data);
            setSuccess('User added successfully!');
            setFormData({ firstname: '', lastname: '', email: '', city: '' });
            setTimeout(() => setSuccess(''), 3000);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding user');
        }
    };

    return (
        <div className="card p-4 mb-4">
            <h2 className="mb-3">Add New User</h2>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                {['firstname', 'lastname', 'email', 'city'].map(field => (
                    <div key={field} className="mb-3">
                        <label className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            className="form-control"
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                        Add User
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default UserForm;