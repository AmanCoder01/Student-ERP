import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0  bg-gray-700/60 transition-opacity" 
                     onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full mx-4">
                    <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg font-medium leading-6 text-white text-center mb-4">
                            {title}
                        </h3>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;