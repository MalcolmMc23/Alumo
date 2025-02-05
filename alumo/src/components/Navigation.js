import React from 'react';
import Link from 'next/link';

const Navigation = () => {
    return (
        <nav className="sidebar">
            <h2>Alumo</h2>
            <ul>
                <li><Link href="/" style={{
                    backgroundColor: '#7C4DFF',
                    color: '#FFFFFF',
                    border: '2px solid #000000',
                    borderRadius: '20px',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                    display: 'inline-block',
                    textDecoration: 'none'
                }}>Explore</Link></li>
                <li><Link href="/ai-chat" style={{
                    backgroundColor: '#7C4DFF',
                    color: '#FFFFFF',
                    border: '2px solid #000000',
                    borderRadius: '20px',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                    display: 'inline-block',
                    textDecoration: 'none'
                }}>AI Chat</Link></li>
            </ul>
        </nav>
    );
};

export default Navigation; 