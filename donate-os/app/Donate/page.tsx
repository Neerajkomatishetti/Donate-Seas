"use client";

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Copy,
  Check,
  Landmark,
  User,
  CreditCard,
  Hash,
  ArrowRight,
} from "lucide-react";

type AccountInfoProps = {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
};

const AccountInfo: React.FC<AccountInfoProps> = ({
  accountHolder,
  accountNumber,
  bankName,
  ifsc,
}) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { label: "Account Holder", value: accountHolder, icon: User },
    { label: "Account Number", value: accountNumber, icon: Hash },
    { label: "Bank Name", value: bankName, icon: Landmark },
    { label: "IFSC Code", value: ifsc, icon: CreditCard },
  ];

  return (
    <div className="relative flex flex-col w-full min-h-[80vh] justify-center items-center px-4 overflow-hidden">
      {/* Background Glows - Theme Aware */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-xl group">
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.03] dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl transition-all hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-primary/5">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">
                Transfer Details
              </h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                Bank Information
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-3 mb-10">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-black/5 dark:hover:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/10 transition-all group/item"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-black/[0.05] dark:border-white/10 group-hover/item:text-primary transition-colors shadow-sm dark:shadow-none">
                    <field.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                      {field.label}
                    </p>
                    <p className="font-mono text-sm tracking-tight text-slate-800 dark:text-white/90">
                      {field.value}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(field.value)}
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
                  title={`Copy ${field.label}`}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button
            className="w-full h-14 rounded-2xl text-base font-bold transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
            variant="greenButton"
            onClick={() => router.push("/Upload")}
          >
            I have Made the Transfer
            <ArrowRight className="h-5 w-5" />
          </Button>

          {/* Corner Decor */}
          <div className="absolute top-0 right-0 p-3 opacity-[0.05] dark:opacity-20">
            <div className="w-20 h-20 border-t border-r rounded-tr-3xl border-primary" />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-1000">
          Your donation helps us sustain our research and development.
        </p>
      </div>
    </div>
  );
};

// Example use for transfer (hardcoded)
export const TransferAccountComponent = () => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("Please login!");
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedIn, loading, router]);

  if (loading) return null;

  return (
    <>
      {isLoggedIn && (
        <AccountInfo
          accountHolder="Rajesh Kumar"
          accountNumber="123456789101"
          bankName="State Bank of India"
          ifsc="SBIN0009999"
        />
      )}
    </>
  );
};

export default TransferAccountComponent;
