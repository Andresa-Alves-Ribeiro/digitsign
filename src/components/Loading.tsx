import React from 'react';

interface LoadingProps {
    text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = 'Carregando...' }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center w-full h-full bg-white">
            <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100/30 animate-ping absolute"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-green-100 relative"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin absolute top-0 left-0"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-transparent border-b-green-400 border-l-green-400 animate-spin-reverse absolute top-0 left-0"></div>
            </div>
            <div className="mt-4 sm:mt-6 flex items-center space-x-2">
                <p className="text-green-500 font-medium text-xs sm:text-sm">
                    {text}
                </p>
                <div className="flex space-x-1">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading; 