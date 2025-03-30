import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import loginBackground from "@/assets/images/login-background.png";
import Loading from "@/components/Loading";
import FormField from "@/components/FormField";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/constants/schemas";
import { commonStyles } from "@/constants/styles";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        await login(data);
    };

    return (
        <AuthGuard>
            <div className="min-h-screen flex">
                {/* Left side - Background Image */}
                <div className="hidden lg:flex lg:w-3/5 relative">
                    <Image
                        src={loginBackground}
                        alt="Login Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Right side - Login Form */}
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
                            <h1 className="text-3xl font-bold text-gray-800">Bem-vindo de volta!</h1>
                            <p className="text-gray-600 mt-2">Entre com suas credenciais</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={commonStyles.button.primary}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Entrando...
                                    </div>
                                ) : (
                                    "Entrar"
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{" "}
                                <Link href="/register" className={commonStyles.link}>
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthGuard>
    );
}