import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { AuthBackground } from '@/components/AuthBackground';
import { PageTransition } from '@/components/ui/PageTransition';

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
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password);
      router.push('/');
    } catch {
      // Error toast is already handled in useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      <AuthBackground />
      <PageTransition>
        <div className="w-full max-w-md bg-neutral-50 rounded-lg shadow-md p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Criar uma conta</h1>
            <p className="mt-2 text-gray-600">Preencha os dados para se registrar</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField<RegisterFormData>
              label="Nome"
              name="name"
              type="text"
              placeholder="Seu nome completo"
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
              Criar conta
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700">
              Faça login
            </Link>
          </p>
        </div>
      </PageTransition>
    </div>
  );
}