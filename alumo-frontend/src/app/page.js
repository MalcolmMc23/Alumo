import React from 'react';

export default function Home() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-purple-100 p-4">
                <h1 className="text-2xl font-bold">Alumo</h1>
                <ul className="mt-4">
                    <li className="py-2">Explore</li>
                    <li className="py-2">AI Chat</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">University of Oregon</h2>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Reply</button>
                </div>

                {/* Videos Section */}
                <div className="bg-gray-100 p-4 rounded">
                    <h3 className="text-lg font-bold mb-4">Videos for you</h3>
                    <div className="flex items-center">
                        <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/600x200)' }}></div>
                        <div className="ml-4">
                            <h4 className="text-md font-semibold">Career Tips & Tricks</h4>
                            <p className="text-sm text-gray-600">Career Success</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 