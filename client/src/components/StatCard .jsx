import React from 'react';

const StatCard = ({ icon, title, value, color }) => {
    // Define color classes for easy use
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        indigo: 'bg-indigo-100 text-indigo-600',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 rounded-full ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-300 font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-300">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;