import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";

const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                },
            });
            router.push("/login");
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input {...register("name")} className="w-full p-2 border rounded" />
                    {formState.errors.name && (
                        <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input {...register("email")} className="w-full p-2 border rounded" />
                    {formState.errors.email && (
                        <p className="text-red-500 text-sm">{formState.errors.email.message}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input {...register("password")} type="password" className="w-full p-2 border rounded" />
                    {formState.errors.password && (
                        <p className="text-red-500 text-sm">{formState.errors.password.message}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Confirm Password</label>
                    <input {...register("confirmPassword")} type="password" className="w-full p-2 border rounded" />
                    {formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{formState.errors.confirmPassword.message}</p>
                    )}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}