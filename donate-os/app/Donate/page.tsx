"use client"

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  ifsc
}) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const accountInfoText = `
    Account Holder: ${accountHolder}
    Account Number: ${accountNumber}
    Bank Name: ${bankName}
    IFSC Code: ${ifsc}`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountInfoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col w-full h-[60%] justify-center items-center">
      <div className="p-4 relative border h-fit w-[80%] rounded-lg shadow bg-secondary max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2 flex justify-between">
        Account Information
        <button
          className="ml-2 p-1 hover:bg-gray-100 rounded"
          title="Copy info"
          onClick={handleCopy}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" fill="#fff" stroke="#4B5563" strokeWidth="1.5"/>
            <rect x="3" y="3" width="13" height="13" rx="2" stroke="#4B5563" strokeWidth="1.5"/>
          </svg>
        </button>
        {copied && (
          <span className="ml-2 text-green-600 text-sm font-medium">Copied!</span>
        )}
      </h2>
        <div className="mb-1">
          <span className="font-bold">Account Holder: </span>
          {accountHolder}
        </div>
        <div className="mb-1">
          <span className="font-bold">Account Number: </span>
          {accountNumber}
        </div>
        <div className="mb-1">
          <span className="font-bold">Bank Name: </span>
          {bankName}
        </div>
        <div className="mb-1">
          <span className="font-bold">IFSC Code: </span>
          {ifsc}
        </div>
        <div>
          <Button variant="greenButton"  onClick={() => {
            router.push("/Upload");
          }}>Register Your Donation</Button>
        </div>
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
  }, [isLoggedIn, loading]);

  if (loading) return null; // Or show a spinner

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
