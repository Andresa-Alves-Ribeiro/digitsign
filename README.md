<h1 align="center">
	DigitSign - Document Signature Platform
</h1>

<p align="center">
 <a href="#technologies">Technologies</a> •
 <a href="#features">Features</a> •
 <a href="#prerequisites">Prerequisites</a> •
 <a href="#how-to-run">How to Run</a> •
 <a href="#live-demo">Live Demo</a> •
 <a href="#project-structure">Structure</a> •
 <a href="#database">Database</a> •
 <a href="#tests">Tests</a> •
 <a href="#license">License</a> •
 <a href="#author">Author</a>
</p>

## 📝 About the Project

DigitSign is a modern web application that I developed as part of a technical assessment. It's a document signature platform that allows users to upload documents and add digital signatures securely. The platform features a clean, intuitive interface and robust functionality for document management and signing.

<a id="features"></a>

## ✨ Features

- 🔐 User Authentication
  - Email/Password login
  - Session management
  - Protected routes
  - Secure password hashing
  - Error pages

- 📄 Document Management
  - Document upload
  - File type validation
  - Document listing
  - Document status tracking
  - Document deletion

- ✍️ Digital Signature
  - Signature pad integration
  - Signature creation
  - Signature verification
  - Multiple signatures per document

- 🎨 UI/UX
  - Responsive design
  - Tailwind CSS styling
  - Smooth animations with Framer Motion
  - Toast notifications
  - Loading states
  - Error handling

- 🔍 Document Status
  - Real-time status updates
  - Signature tracking
  - Document history

- 🛡️ Security
  - Secure authentication
  - Protected API routes
  - File upload validation
  - Data validation with Zod
  - Environment variable protection

- 📱 Responsive Design
  - Mobile-first approach
  - Desktop optimization
  - Tablet support
  - Adaptive layouts

## 📸 Screenshots

<p align="center">Versão Desktop</p>

![Captura de tela 2025-05-23 153941](https://github.com/user-attachments/assets/4d3d7f62-e692-4c8a-9cb2-324aa6d9c66c)


<p align="center">
  <img src="https://raw.githubusercontent.com/Andresa-Alves-Ribeiro/teste-tecnico-digitsign/main/public/screenshots/mobile.png" alt="Versão Mobile" />
</p>

<a id="technologies"></a>

## 🛠️ Technologies

- **Frontend:**
  - Next.js 15
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Query (TanStack Query)
  - Zustand (State Management)
  - React Hook Form
  - Zod (Schema Validation)
  - Framer Motion (Animations)
  - React Signature Canvas
  - React Hot Toast (Notifications)
  - Heroicons
  - Date-fns (Date manipulation)

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - Neon (PostgreSQL Database)
  - NextAuth.js
  - bcryptjs (Password Hashing)
  - UUID (Unique identifiers)

- **Development Tools:**
  - ESLint
  - Prettier
  - TypeScript
  - Jest
  - React Testing Library
  - Jest DOM
  - PostCSS
  - Autoprefixer

- **Deployment:**
  - Vercel

<a id="prerequisites"></a>

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

<a id="how-to-run"></a>

## 🚀 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/Andresa-Alves-Ribeiro/teste-tecnico-digitsign.git
   cd digitsign
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

<a id="live-demo"></a>

## 🌐 Live Demo

https://digitsign.vercel.app/

Email: admin@email.com
Senha: 123456

<a id="project-structure"></a>

## 📁 Project Structure

```
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable components
│   ├── lib/          # Utility functions and configurations
│   ├── types/        # TypeScript type definitions
│   ├── pages/        # Next.js pages directory
│   ├── utils/        # Utility functions
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Layout components
│   ├── services/     # API and external services
│   ├── store/        # State management (Zustand)
│   ├── assets/       # Static assets (images, icons)
│   ├── constants/    # Constants and configuration
│   ├── features/     # Feature-specific components and logic
│   └── styles/       # Global styles and CSS modules
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── uploads/          # Uploaded documents storage
```

<a id="database"></a>

## 💾 Database

The application uses three main models:

- **User**: Stores user information
- **Document**: Manages uploaded documents
- **Signature**: Stores signature information for documents

<a id="tests"></a>

## 🧪 Tests

Tests are currently being implemented using Jest and React Testing Library. The test suite will include:

- Unit tests for components
- Integration tests for features
- End-to-end testing
- API route testing

Once implemented, tests can be run using:

```bash
npm run test
```

For development with watch mode:

```bash
npm run test:watch
```

<a id="license"></a>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<a id="author"></a>

## 🦸 Author

Hi! 👋 I'm Andresa Alves Ribeiro, a Front-end/Full-Stack developer and Information Systems student. I love creating solutions to complex problems and am always excited to learn new technologies.

This project was developed as part of a technical assessment, showcasing my skills in modern web development, particularly with Next.js, TypeScript, and full-stack development practices.

### Connect with me:

<p align="center">
  <a href="mailto:andresa_15ga@hotmail.com"><img src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ff69b4&logo=gmail&label=Email&message=andresa_15ga@hotmail.com&color=ff69b4" target="_blank"></a>
  <a href="https://www.linkedin.com/in/andresa-alves-ribeiro/"><img alt="LinkedIn Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=andresa-alves-ribeiro&color=0A66C2"></a>
  <a href="https://www.instagram.com/dresa.alves/"><img alt="Instagram Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@dresa.alves&color=E4405F"></a>
</p>
