import React from 'react';

const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="university-name">University of Oregon</div>
            <div className="profile-section">
                <img src="/path/to/profile.jpg" alt="Profile" className="profile-pic" />
                <div className="notifications">🔔</div>
            </div>
        </div>
    );
};

export default TopBar; 