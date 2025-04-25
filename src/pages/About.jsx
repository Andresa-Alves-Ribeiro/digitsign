function About() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-6">
            About SuperSign
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
            We're on a mission to revolutionize the way businesses handle digital signatures 
            and document management.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-component-bg-light dark:bg-component-bg-dark p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Our Mission
            </h2>
            <p className="text-text-light/70 dark:text-text-dark/70">
              To provide secure, efficient, and user-friendly digital signature solutions 
              that empower businesses to streamline their document workflows and accelerate 
              their digital transformation journey.
            </p>
          </div>
          <div className="bg-component-bg-light dark:bg-component-bg-dark p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Our Vision
            </h2>
            <p className="text-text-light/70 dark:text-text-dark/70">
              To become the global leader in digital signature solutions, setting the 
              standard for security, innovation, and customer satisfaction in the industry.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-component-bg-light dark:bg-component-bg-dark rounded-xl shadow-sm"
              >
                <div className="w-16 h-16 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                  {value.title}
                </h3>
                <p className="text-text-light/70 dark:text-text-dark/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-12">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-light dark:text-primary-dark mb-2">
                  {member.role}
                </p>
                <p className="text-text-light/70 dark:text-text-dark/70">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const values = [
  {
    title: 'Innovation',
    description: 'We constantly push boundaries to deliver cutting-edge solutions.',
    icon: <svg className="w-8 h-8 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  {
    title: 'Security',
    description: 'We prioritize the safety and privacy of our customers' data.',
    icon: <svg className="w-8 h-8 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  },
  {
    title: 'Customer Focus',
    description: 'We put our customers first in everything we do.',
    icon: <svg className="w-8 h-8 text-primary-light dark:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  }
]

const team = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    bio: 'With over 15 years of experience in the tech industry, John leads our vision for innovation.'
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    bio: 'Sarah brings extensive expertise in cybersecurity and software architecture to our team.'
  },
  {
    name: 'Michael Chen',
    role: 'Head of Product',
    bio: 'Michael ensures our products meet the highest standards of quality and user experience.'
  }
]

export default About 