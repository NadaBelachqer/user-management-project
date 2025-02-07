import React, { useState } from 'react';
import UserForm from './UserForm';

const SearchBar = ({ searchQuery, setSearchQuery, addUser }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <div style={styles.searchHeader}>
              { /* <input
                    type="text"
                    placeholder="Search User"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px', width: '300px' }}
                />*/}
                <button 
                    style={styles.addUserButton} 
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close" : "Add User"}
                </button>
            </div>

            {showForm && <UserForm addUser={addUser} />}
        </div>
    );
};

const styles = {
    searchHeader: {
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addUserButton: {
        padding: '10px 20px',
        backgroundColor: '#FFA523',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px',
    },
};

export default SearchBar;
