import React from 'react';

const Header = () => {
    return (
        <header style={styles.header}>
            <img src="/assets/logo.png" alt="Logo" style={styles.logo} />
            <h1 style={styles.title}>User Management</h1>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#715ec5',
        padding: '10px 20px',  
        display: 'flex',
        alignItems: 'center', 
    },
    logo: {
        width: '30px', 
        height: '30px',
        marginRight: '15px', 
    },
    title: {
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
    },
};

export default Header;
