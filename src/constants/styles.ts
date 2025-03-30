export const commonStyles = {
    input: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 outline-0",
    button: {
        primary: "w-max bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer",
        secondary: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 cursor-pointer",
        danger: "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        ghost: "p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer",
        icon: "p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer",
        clear: "flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer",
        cancel: "flex-1 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer",
        save: "flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer",
        delete: "p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 relative group cursor-pointer",
    },
    link: "text-green-600 hover:text-green-800 font-medium",
    label: "block text-sm font-medium text-gray-700 mb-2",
    error: "text-red-500 text-sm mt-1",
    icon: "absolute left-3 top-3.5 h-5 w-5 text-gray-400",
} as const; 