import { User } from './user';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}

export interface LogoutButtonProps {
  onLogout: () => void;
} 