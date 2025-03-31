<h1 align="center"> 
	 SuperSign Test
</h1>

# SuperSign - Document Signature Platform

<p align="center">
 <a href="#-about-the-project">About</a> •
 <a href="#-technologies">Technologies</a> •
 <a href="#-features">Features</a> •
 <a href="#-prerequisites">Prerequisites</a> •
 <a href="#-how-to-run">How to Run</a> •
 <a href="#-project-structure">Structure</a> •
 <a href="#-database">Database</a> •
 <a href="#-tests">Tests</a> •
 <a href="#-contributing">Contributing</a> •
 <a href="#-license">License</a> •
 <a href="#-author">Author</a>
</p>

## 📝 About the Project

SuperSign is a modern web application built with Next.js that allows users to upload documents and add digital signatures. The platform provides a secure and user-friendly interface for document management and signing.

## ✨ Features

- 🔐 User Authentication
- 📄 Document Upload and Management
- ✍️ Digital Signature Creation
- 📱 Responsive Design
- 🔍 Document Status Tracking
- 🎨 Modern UI with Material-UI and Tailwind CSS

## 🛠️ Technologies

- **Frontend:**

  - Next.js 15
  - React 18
  - TypeScript
  - Material-UI
  - Tailwind CSS
  - React Query
  - Zustand (State Management)
  - React Hook Form
  - Zod (Schema Validation)

- **Backend:**

  - Next.js API Routes
  - Prisma ORM
  - SQLite Database
  - NextAuth.js
  - bcryptjs (Password Hashing)

- **Testing:**
  - Jest
  - React Testing Library
  - Jest DOM

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## 🚀 How to Run

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd teste-tecnico-supersign
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
   DATABASE_URL="postgresql://postgres.grldgmzqdcsjbpqbzxao:aBTgAtweP09AJUdM@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
   NEXTAUTH_SECRET="yD9d59S6Hh2rrTueb6+43DWnhMSJpeKRB41dvAWcAag="  # Gerado com: openssl rand -base64 32
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

## 🌐 Live Demo

Vercel deployment in construction


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

## 💾 Database

The application uses three main models:

- **User**: Stores user information
- **Document**: Manages uploaded documents
- **Signature**: Stores signature information for documents

## 🧪 Tests

The project includes a comprehensive test suite using Jest and React Testing Library. Run tests using:

```bash
npm run test
```

For development with watch mode:

```bash
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🦸 Author

Hi, I'm Andresa A Ribeiro, a Front-end/Full-Stack developer, Information Systems student, and always eager to learn more.

<p align="center">
  <a href="mailto:andresa_15ga@hotmail.com"><img src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ff69b4&logo=gmail&label=Outlook&message=andresa_15ga@hotmail.com&color=ff69b4" target="_blank">
  <a href= "https://www.linkedin.com/in/andresa-alves-ribeiro/"><img alt="profile linkedin Andresa Alves" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=andresa-alves-ribeiro&color=0A66C2"></a>
  <a href= "https://www.instagram.com/dresa.alves/"><img alt="profile instagram Andresa Alves" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@dresa.alves&color=E4405F"></a>
</p>
