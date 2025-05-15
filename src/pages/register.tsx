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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <AuthBackground />
      
      <PageTransition>
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-3">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Criar Conta</h1>
              <p className="mt-1 text-md text-gray-600">Preencha os dados para se registrar</p>
            </div>

            <div className="bg-white py-5 px-6 shadow-xl rounded-2xl border border-gray-100">
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
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}