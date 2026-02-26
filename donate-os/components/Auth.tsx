"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type authprops = {
  name: string;
  email: string;
  password: string;
};

const Auth = ({ AuthType }: { AuthType: "Signin" | "Signup" }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [authDetails, setAuthDetails] = useState<authprops>({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/${AuthType}`, {
        name: authDetails.name,
        email: authDetails.email,
        password: authDetails.password,
      });

      if (response.data?.token) {
        const userData = {
          id: response.data.id || "temp-id",
          email: authDetails.email,
          name: authDetails.name,
          isAdmin: response.data.isAdmin || false,
        };

        login(response.data.token, userData);
        router.push("/");
      } else {
        throw new Error(response.data?.message || "Authentication failed");
      }
    } catch (err: unknown) {
      console.error("Authentication error:", err);
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? // @ts-expect-error narrowing axios error shape
            err.response?.data?.message
          : (err as Error).message;
      setError(message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex w-full min-h-[90vh] justify-center items-center px-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[340px]">
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.03] dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl transition-all">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">
              {AuthType === "Signin" ? "Welcome Back" : "Register Now"}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {AuthType === "Signin"
                ? "Enter your credentials to access your account"
                : "Create an account to start contributing"}
            </p>
          </div>

          <div className="grid gap-2.5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[9px] px-3 py-1.5 rounded-xl animate-in fade-in slide-in-from-top-2 text-center">
                {error}
              </div>
            )}

            {AuthType === "Signup" && (
              <div className="grid gap-1">
                <Label
                  htmlFor="username"
                  className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="username"
                    className="pl-10 h-10 bg-black/[0.03] dark:bg-white/5 border-transparent focus:border-primary/50 rounded-xl transition-all text-xs"
                    placeholder="John Doe"
                    value={authDetails.name}
                    onChange={(e) =>
                      setAuthDetails({ ...authDetails, name: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div className="grid gap-1">
              <Label
                htmlFor="email"
                className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10 h-10 bg-black/[0.03] dark:bg-white/5 border-transparent focus:border-primary/50 rounded-xl transition-all text-xs"
                  placeholder="name@example.com"
                  value={authDetails.email}
                  onChange={(e) =>
                    setAuthDetails({ ...authDetails, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label
                htmlFor="password"
                className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 h-10 bg-black/[0.03] dark:bg-white/5 border-transparent focus:border-primary/50 rounded-xl transition-all text-xs"
                  placeholder="••••••••"
                  value={authDetails.password}
                  onChange={(e) =>
                    setAuthDetails({ ...authDetails, password: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-10 mt-1 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 text-xs"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {AuthType === "Signin" ? "Login" : "Create Account"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/[0.05] dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase">
                <span className="bg-transparent px-2 text-muted-foreground font-bold tracking-widest backdrop-blur-md">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-10 rounded-xl border-black/[0.1] dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-semibold text-xs"
              onClick={() => {
                alert("Social login is coming soon!");
              }}
            >
              <Github className="h-4 w-4" />
              Github
            </Button>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium">
              {AuthType === "Signin"
                ? "New to DonateOS? "
                : "Already have an account? "}
              <button
                className="font-bold text-primary hover:underline transition-all"
                onClick={() =>
                  router.push(
                    `/Auth/${AuthType === "Signin" ? "Signup" : "Signin"}`,
                  )
                }
              >
                {AuthType === "Signin" ? "Create account" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
