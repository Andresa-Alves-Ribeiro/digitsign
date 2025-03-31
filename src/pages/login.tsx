import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import FormField from '@/components/FormField';
import { Button } from '@/components/Button';
import { toast } from 'react-hot-toast';
import background from '@/assets/images/background.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data);
      router.push('/');
    } catch (error) {
      // Error toast is already handled in useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 bg-gray-900 relative">
        <Image
          src={background}
          alt="Background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h1>
            <p className="mt-2 text-gray-600">Faça login para continuar</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField<LoginFormData>
              label="Email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              register={register}
            />
            <FormField<LoginFormData>
              label="Senha"
              name="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              register={register}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-green-600 hover:text-green-700">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}