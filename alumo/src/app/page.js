import React from 'react';
import Navigation from '../components/Navigation';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';

const Home = () => {
    return (
        <div>
            <Navigation />
            <TopBar />
            <div className="content">
                <h1>Welcome to Alumo</h1>
                <p>Your personalized career platform.</p>
                <div className="video-section">
                    <VideoCard title="Career Tips & Tricks" description="Learn the best career tips." thumbnail="/path/to/thumbnail1.jpg" />
                    <VideoCard title="Resume Building" description="How to build a strong resume." thumbnail="/path/to/thumbnail2.jpg" />
                    <VideoCard title="Interview Techniques" description="Ace your interviews with these techniques." thumbnail="/path/to/thumbnail3.jpg" />
                </div>
            </div>
        </div>
    );
};

export default Home; 