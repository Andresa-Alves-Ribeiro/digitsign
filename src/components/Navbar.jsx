import { Link } from 'react-router-dom'
import ThemeToggleButton from './ThemeToggleButton'

export default function Navbar() {
  return (
    <nav className="bg-background-light dark:bg-background-dark shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            SuperSign
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <div className="ml-4 border-l border-gray-300 dark:border-gray-700 pl-4">
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 