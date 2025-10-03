import React from 'react';

const ResponsiveTable = ({ headers, children, noDataMessage }) => {
    return (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTable;