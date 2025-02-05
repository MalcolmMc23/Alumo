import React from 'react';

const VideoCard = ({ title, description, thumbnail }) => {
    return (
        <div className="video-card">
            <img src={thumbnail} alt={title} className="thumbnail" />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default VideoCard; 