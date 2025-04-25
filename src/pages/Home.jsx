import { ArrowRightIcon } from '@heroicons/react/24/outline'
import TestIcons from '../components/TestIcons'
import TestThemeToggle from '../components/TestThemeToggle'
import TestThemeContext from '../components/TestThemeContext'
import SimpleThemeToggle from '../components/SimpleThemeToggle'
import ThemeToggleButton from '../components/ThemeToggleButton'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-6">
                Transform Your Digital Experience with SuperSign
              </h1>
              <p className="text-lg text-text-light/80 dark:text-text-dark/80 mb-8">
                The ultimate solution for digital signatures and document management. 
                Secure, fast, and easy to use.
              </p>
              <button className="bg-primary-light dark:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                Get Started
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-light/20 to-primary-dark/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Icons Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <TestIcons />
        </div>
      </section>

      {/* Test Theme Toggle Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <TestThemeToggle />
        </div>
      </section>

      {/* Test Theme Context Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <TestThemeContext />
        </div>
      </section>

      {/* Simple Theme Toggle Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Botão de Tema Simplificado</h2>
            <SimpleThemeToggle />
          </div>
        </div>
      </section>

      {/* Theme Toggle Button Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Botão de Tema com Emoji</h2>
            <ThemeToggleButton />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-12">
            Why Choose SuperSign?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-component-bg-light dark:bg-component-bg-dark rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-light/70 dark:text-text-dark/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: 'Secure Signatures',
    description: 'Bank-level security for all your digital signatures and documents.',
    icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  },
  {
    title: 'Easy Integration',
    description: 'Seamlessly integrate with your existing workflow and tools.',
    icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock support to help you with any questions.',
    icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  }
]

export default Home 