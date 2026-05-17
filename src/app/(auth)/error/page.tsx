"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

function getErrorMessage(err: string): string {
  switch (err) {
    case "Configuration":
      return "There is a problem with the server configuration. Please contact support.";
    case "AccessDenied":
      return "You do not have permission to sign in.";
    case "Verification":
      return "The verification link has expired or has already been used.";
    case "CredentialsSignin":
      return "Invalid email or password. Please try again.";
    default:
      return "An unexpected authentication error occurred.";
  }
}

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Authentication Error
      </h1>
      <p className="text-sage-500 mb-3 text-sm leading-relaxed">
        {getErrorMessage(error)}
      </p>
      <p className="text-xs text-sage-400 mb-8 font-mono bg-cream-50 px-3 py-1.5 rounded-lg inline-block">
        Error Code: <span className="font-bold uppercase">{error}</span>
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/login">
          <Button variant="primary" className="w-full" id="auth-error-try-again">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full" id="auth-error-back-home">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><RefreshCw className="h-8 w-8 animate-spin text-brand-500" /></div>}>
      <ErrorContent />
    </Suspense>
  );
}
