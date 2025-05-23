import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { AuthBackground } from '@/components/AuthBackground';
import { PageTransition } from '@/components/ui/PageTransition';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES, TOAST_CONFIG } from '@/constants/toast';
import { useRouter } from 'next/router';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    await registerUser(data.name, data.email, data.password);
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsSocialLoading(provider);
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
      } else if (result?.ok) {
        router.push('/');
        toast.success(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG);
      }
    } catch (error) {
      console.error('Social login error:', error);
      toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-50">
      <AuthBackground />
      
      <PageTransition>
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-3">
              <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Criar Conta</h1>
              <p className="mt-1 text-md text-neutral-500">Preencha os dados para se registrar</p>
            </div>

            <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-neutral-100">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <FormField<RegisterFormData>
                  label="Nome"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  error={errors.name?.message}
                  register={register}
                />
                <FormField<RegisterFormData>
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  error={errors.email?.message}
                  register={register}
                />
                <FormField<RegisterFormData>
                  label="Senha"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  register={register}
                />
                <FormField<RegisterFormData>
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  register={register}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Registrar
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">Ou cadastre-se com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isSocialLoading !== null}
                    className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSocialLoading === 'google' ? (
                      <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="sr-only">Sign in with Google</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isSocialLoading !== null}
                    className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSocialLoading === 'github' ? (
                      <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="sr-only">Sign in with GitHub</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}