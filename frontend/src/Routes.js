import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import UserForm from './components/UserForm';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/add-user" element={<UserForm />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
