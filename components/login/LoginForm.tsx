"use client";

import {useState} from "react";
import Link from "next/link";
import {Button} from "../ui/button";
import {toast} from "sonner";
import {supabaseBrowserClient} from "@/lib/supabase/client";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Te rugăm să completezi toate câmpurile");
            return;
        }
        setLoading(true);
        const {error} = await supabaseBrowserClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            if (error.code === "invalid_credentials") {
                toast.error(
                    "Utilizator negăsit sau parolă incorectă. Te rugăm să verifici parola și să încerci din nou."
                );
                return;
            }
            toast.error(
                "A apărut o eroare!",
                {
                    description: error.message
                }
            );
            return;
        }
        console.log("Login successful");
        // router.push("/cont"); // No need to redirect. User will be redirected to the account page by the AuthToAccountRedirect
    };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Conectare cont
      </h2>
      <div className="space-y-6">
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
          onClick={handleLogin}
          className="w-full rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Se procesează..." : "Autentificare"}
        </Button>
      </div>
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
