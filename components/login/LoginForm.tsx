"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/cont");
    } catch (error: any) {
      console.error("Error signing in:", error);
      if (error.code === "auth/user-not-found") {
        toast({
          title: "Utilizator negăsit",
          description: "Te rugăm să verifici emailul sau să te înregistrezi.",
          action: (
            <ToastAction
              altText="Înregistrare"
              onClick={() => router.push("/inscrie-te")}
            >
              Înregistrare
            </ToastAction>
          ),
        });
      } else if (error.code === "auth/wrong-password") {
        toast({
          title: "Parolă incorectă",
          description: "Te rugăm să verifici parola și să încerci din nou.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Eroare",
          description: "A apărut o eroare. Te rugăm să încerci din nou.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Conectare cont
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-hope-darkcyan focus:ring-1 focus:ring-hope-darkcyan"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Parolă
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-hope-dark-cyan focus:ring-1 focus:ring-hope-dark-cyan"
            required
            disabled={loading}
          />
        </div>
        <div className="flex items-center justify-end">
          <Link
            href="/reset-password"
            className="text-sm text-hope-darkcyan hover:underline"
          >
            Am uitat parola
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Se procesează..." : "Autentificare"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Nu te-ai înscris încă în tabără?{" "}
        <Link
          href="/inscrie-te"
          className="text-hope-darkcyan hover:underline font-medium"
        >
          Înscrie-te aici
        </Link>
      </p>
    </div>
  );
}
