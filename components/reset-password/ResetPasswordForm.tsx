"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FirebaseError } from "firebase/app";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setSentToEmail(email);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setError("Adresa de email este invalidă.");
            break;
          case "auth/user-not-found":
            setError("Nu există niciun cont asociat cu acest email.");
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Resetare parola
      </h2>

      {emailSent ? (
        <div className="text-center space-y-6">
          <p className="text-sm text-gray-600">
            Un email a fost trimis la adresa <strong>{sentToEmail}</strong>.
            Verifică-ți inbox-ul sau folderul de spam pentru a reseta parola.
          </p>
          <Link
            href="/login"
            className="block w-full bg-hope-green text-white py-2.5 px-4 rounded-md hover:bg-hope-green/90 transition-colors text-sm font-medium text-center"
          >
            ← Înapoi la login
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 text-center mb-6">
            Introdu adresa de email pentru a primi un link de resetare a
            parolei.
          </p>

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
            <button
              type="submit"
              className="w-full bg-hope-green text-white py-2.5 px-4 rounded-md hover:bg-hope-green/90 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              disabled={loading}
            >
              {loading ? "Se procesează..." : "Resetare parolă"}
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
        </>
      )}
    </div>
  );
}
