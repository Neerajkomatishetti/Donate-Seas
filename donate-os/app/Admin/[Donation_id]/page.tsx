"use client"

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import type { DonationProps } from "../Donations/page";
import { useEffect } from "react";
  

  const DonationDetails = () =>{
    const Params = useParams()
    const Donation_id = Params.Donation_id?? null

  

    useEffect(() =>{
      
    },[])

    return (
        // <div>
        //     <h1>{Transactions[Number(Donation_id)].Name || "Anonymous"}</h1>
        //     <p>{Transactions[Number(Donation_id)].Amount}</p>
        //     <p>{Transactions[Number(Donation_id)].Status}</p>
        //     <p>{Transactions[Number(Donation_id)].Date}</p>
            
        // </div>
        <div className="flex flex-col w-full items-center h-full px-5">
          <div
            className="flex flex-col px-4 p-2 w-full md:max-w-[40%] border my-4 bg-secondary rounded-lg"
          >
            <a
            href="https://gekzkmggkbzsqzhglmgw.supabase.co/storage/v1/object/public/Images/image.png">
               <img alt="payment receipt" src="https://gekzkmggkbzsqzhglmgw.supabase.co/storage/v1/object/public/Images/image.png" />
            </a>
            <div className="flex justify-between border-b my-4">
              <h2 className="font-bold text-lg px-2">
                {Transactions[Number(Donation_id)].Name || "Anonymous"}
              </h2>
            <Button className="h-6 mb-2 px- hover:cursor-pointer">
                  Approve
            </Button>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <h3 className="font-bold text-gray-500 px-2">Amount:</h3>
                <p className="font-mono text-sm"> ₹{Transactions[Number(Donation_id)].Amount}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-gray-secondary">
                  {Transactions[Number(Donation_id)].Date}
                </p>
              </div>
            </div>
          </div>
      </div>
    )
  }

  export default DonationDetails;