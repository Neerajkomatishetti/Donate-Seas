"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type TransactionProps = {
    Amount: number;
    Status: string;
    Date: string;
  };
  
  const Transactions: TransactionProps[] = [
    {
      Amount: 6000,
      Status: "Pending",
      Date: "12-05-2025",
    },
    {
      Amount: 6000,
      Status: "Pending",
      Date: "12-05-2025",
    },
    {
      Amount: 6000,
      Status: "Pending",
      Date: "12-05-2025",
    },
    {
      Amount: 6000,
      Status: "Pending",
      Date: "12-05-2025",
    },
  ];
  
  export const DonationStatus = () => {
    const router = useRouter();

    return (
      <div className="w-full mt-5">
        <div className="flex justify-between w-full h-fit px-4">
            <h1 className="flex items-center text-lg font-bold">Donations</h1>
            <Button variant={"secondary"} onClick={() =>{
                router.push("./");
            }}>Register a Donation</Button>
        </div>
        {Transactions.map((transaction: TransactionProps, idx) => (
        <div key={idx} className="flex px-4 justify-between p-2 w-full border my-2 shadow-lg shadow-secondary">
            <div>
                <h3 className="font-bold">Amount:</h3>
                <p className="font-mono text-sm"> ₹{transaction.Amount}</p>
            </div>
            <div>
                <p className="pb-2">Status: {transaction.Status}</p>
                <p className="font-mono text-xs text-gray-secondary">{transaction.Date}</p>
            </div>
        </div>
        ))}
      </div>
    );
  };

  export default DonationStatus;
  