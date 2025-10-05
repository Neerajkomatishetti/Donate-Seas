"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col h-auto py-4 px-3 w-[80%] md:w-[35%] [&>*]:my-2 border bg-background text-Primary rounded-lg">
        <h2>{AuthType === "Signin" ? "Login" : "Create an account!"}</h2>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={authDetails.email}
          onChange={(e) => {
            setAuthDetails({
              ...authDetails,
              email: e.target.value,
            });
          }}
        />
        {AuthType === "Signup" && (
          <>
            <Label htmlFor="username">UserName</Label>
            <Input
              id="username"
              value={authDetails.name}
              onChange={(e) => {
                setAuthDetails({
                  ...authDetails,
                  name: e.target.value,
                });
              }}
            />
          </>
        )}
        <Label>Password</Label>
        <Input
          id="password"
          type="password"
          value={authDetails.password}
          onChange={(e) => {
            setAuthDetails({
              ...authDetails,
              password: e.target.value,
            });
          }}
        />

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : AuthType}
        </Button>

        <a
          className="underline"
          href={`/Auth/${AuthType === "Signin" ? "Signup" : "Signin"}`}
        >
          {AuthType === "Signin" ? "Signup" : "Signin"}
        </a>
      </div>
    </div>
  );
};

export default Auth;
