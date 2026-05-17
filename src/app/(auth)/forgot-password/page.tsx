"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", data);
      if (response.data.success) {
        setSent(true);
        toast.success("Reset link sent!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox</h1>
        <p className="text-sage-500 mb-2 text-sm leading-relaxed">
          We sent a password reset link to
        </p>
        <p className="font-semibold text-brand-700 mb-6">{getValues("email")}</p>
        <p className="text-xs text-sage-400 mb-8">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button onClick={() => setSent(false)} className="text-brand-600 hover:underline font-medium">
            try again
          </button>
          .
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full" id="forgot-back-to-login-btn">
            Back to Sign In
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-sage-500 hover:text-brand-600 mb-7 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h1>
        <p className="text-sage-500 text-sm leading-relaxed">
          No worries! Enter your email and we will send you a secure link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          id="forgot-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          id="forgot-submit-btn"
        >
          Send Reset Link
        </Button>
      </form>
    </motion.div>
  );
}
