"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/cont");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setError("Adresa de email este invalidă.");
            break;
          case "auth/user-not-found":
            setError("Nu există niciun cont asociat cu acest email.");
            break;
          case "auth/wrong-password":
            setError("Parola este incorectă.");
            break;
          default:
            setError("A apărut o eroare. Te rugăm să încerci din nou.");
        }
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
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
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
              focus:outline-none focus:border-hope-green focus:ring-1 focus:ring-hope-green"
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
              focus:outline-none focus:border-hope-green focus:ring-1 focus:ring-hope-green"
            required
            disabled={loading}
          />
        </div>
        <div className="flex items-center justify-end">
          <Link
            href="/reset-password"
            className="text-sm text-hope-green hover:underline"
          >
            Am uitat parola
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-hope-green text-white py-2.5 px-4 rounded-md hover:bg-hope-green/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          disabled={loading}
        >
          {loading ? "Se procesează..." : "Autentificare"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Nu te-ai înscris încă în tabără?{" "}
        <Link
          href="/inscrie-te"
          className="text-hope-green hover:underline font-medium"
        >
          Înscrie-te aici
        </Link>
      </p>
    </div>
  );
}
