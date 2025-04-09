"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch user email on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        setError(
          "Nu am putut prelua informațiile utilizatorului. Încearcă să te autentifici din nou."
        );
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!password) {
      setError("Te rugăm să introduci noua parolă.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabaseBrowserClient.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage("Parola a fost actualizată cu succes! Vei fi redirecționat spre contul tău");
      // Redirect to account page after a short delay
      setTimeout(() => {
        router.push("/cont"); // Redirect to the account page
      }, 2000);

    } catch (err: any) {
      console.error("Password update error:", err);
      setError(
        `A apărut o eroare la actualizarea parolei: ${err.message || "Te rugăm să încerci din nou."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Actualizează Parola
      </h2>

      {message && (
        <div className="p-3 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

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
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm shadow-sm"
            disabled // Email is read-only
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Parolă Nouă
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-hope-dark-cyan focus:ring-1 focus:ring-hope-dark-cyan"
            required
            disabled={loading || !!message} // Disable if loading or success message is shown
          />
        </div>
        <button
          type="submit"
          className="w-full bg-hope-dark-cyan border border-red-500 text-red-500 py-2.5 px-4 rounded-md hover:bg-hope-dark-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          disabled={loading || !password || !!message}
        >
          {loading ? "Se actualizează..." : "Actualizează Parola"}
        </button>
      </form>
       {!message && ( // Only show back link if not showing success message
         <p className="mt-6 text-center text-sm text-gray-500">
            <Link
              href="/login"
              className="text-hope-dark-cyan hover:underline font-medium"
            >
              ← Înapoi la login
            </Link>
          </p>
       )}
    </div>
  );
}
