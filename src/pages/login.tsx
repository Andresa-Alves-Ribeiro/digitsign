import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../public/logo.png";
import loginBackground from "../../public/login-background.png";
import Loading from "@/components/Loading";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                ...data,
            });

            if (result?.error) {
                toast.error("Erro ao fazer login. Confira seus dados e tente novamente.", {
                    duration: 4000,
                    position: "top-right",
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <input
                                    {...register("email")}
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 outline-0"
                                    placeholder="seu@email.com"
                                />
                                <svg
                                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </div>
                            {formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type="password"
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 outline-0"
                                    placeholder="••••••••"
                                />
                                <svg
                                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            {formState.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loading text="Entrando..." />
                                </div>
                            ) : (
                                "Entrar"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{" "}
                            <Link href="/register" className="text-green-600 hover:text-green-800 font-medium">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}