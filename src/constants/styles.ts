export const commonStyles = {
    input: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 outline-0",
    button: {
        primary: "w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed",
        secondary: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200",
        danger: "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
    },
    link: "text-green-600 hover:text-green-800 font-medium",
    label: "block text-sm font-medium text-gray-700 mb-2",
    error: "text-red-500 text-sm mt-1",
    icon: "absolute left-3 top-3.5 h-5 w-5 text-gray-400",
} as const; 