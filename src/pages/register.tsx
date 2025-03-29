import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import logo from "../../public/logo.png";
import loginBackground from "../../public/login-background.png";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import FormField from "@/components/FormField";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/constants/schemas";
import { commonStyles } from "@/constants/styles";

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isLoading } = useAuth();
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: any) => {
        await registerUser({
            ...data,
            id: uuidv4(),
        });
    };

    return (
        <AuthGuard>
            <div className="min-h-screen flex">
                {/* Left side - Background Image */}
                <div className="hidden lg:flex lg:w-3/5 relative">
                    <Image
                        src={loginBackground}
                        alt="Register Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Right side - Register Form */}
                <div className="w-full lg:w-2/5 flex items-center justify-center bg-white p-8 border-l">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="mx-auto mb-4 w-auto"
                            />
                            <h1 className="text-3xl font-bold text-gray-800">Criar conta</h1>
                            <p className="text-gray-600 mt-2">Preencha seus dados para começar</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                label="Nome"
                                name="name"
                                placeholder="Seu nome completo"
                                register={register}
                                error={formState.errors.name?.message}
                            />

                            <FormField
                                label="Email"
                                name="email"
                                placeholder="seu@email.com"
                                register={register}
                                error={formState.errors.email?.message}
                            />

                            <FormField
                                label="Senha"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                register={register}
                                error={formState.errors.password?.message}
                            />

                            <FormField
                                label="Confirmar Senha"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                register={register}
                                error={formState.errors.confirmPassword?.message}
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={commonStyles.button.primary}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loading text="Cadastrando..." />
                                    </div>
                                ) : (
                                    "Cadastrar"
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{" "}
                                <Link href="/login" className={commonStyles.link}>
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthGuard>
    );
}