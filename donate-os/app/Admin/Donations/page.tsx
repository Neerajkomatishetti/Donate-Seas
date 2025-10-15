"use client";

import { DonationSkeleton } from "@/components/DonationSkeletons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "primereact/image";
import { useEffect, useState, useCallback } from "react";
// import { token } 


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type DonationProps = {
  id: string;
  name: string;
  amount: number;
  imgurl: string;
  Status: boolean;
  createdAt: string;
};


const Donations = () => {
  const [donations, setDonations] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null
  const [loading, setLoading] = useState<boolean>(true);

  const fetchdonations = useCallback(() =>{
    if (token) {
      axios
        .get(`${BACKEND_URL}/donate/bulk`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setDonations(response.data.donations);
        });
    }
  },[token])

  useEffect(() => {
    fetchdonations();
    setLoading(false)
  }, [fetchdonations]);

  return (
    <div className="flex flex-col w-full items-center h-full px-5">
      <p className="flex w-full justify-center text-red-700">
        this will not be accessable by users in the future only admins are
        allowed!
      </p>
      {!loading ? donations.map((donation: DonationProps) => (
        <div
          key={donation.id}
          className="flex flex-col px-4 p-2 w-full md:w-[40%] border my-2 bg-secondary rounded-lg"
        >
          <div className="card flex justify-center max-h-[30vh] overflow-clip ">
            <Image
              src={donation.imgurl}
              alt="Image"
              width="full"
              preview
              loading="lazy"
              downloadable
            />
          </div>
          <div className="flex justify-between border-b p-3">
            <h2 className="font-bold text-lg px-2">
              {donation.name || "Anonymous"}
            </h2>
            <Button
              onClick={async () => {
                const response = await axios.put(
                  `${BACKEND_URL}/donate/Approve`,
                  {
                    data: {
                      id: donation.id,
                      amount: donation.amount,
                    },
                  },
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                );

                if(response.status == 200){
                  fetchdonations();
                }
              }}
              className="h-6 mb-2 px- hover:cursor-pointer"
              disabled = {donation.Status}
            >
              {donation.Status? "Approved" : "Approve"}
            </Button>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <h3 className="font-bold text-gray-500 px-2">Amount:</h3>
              <p className="font-mono text-sm"> ₹{donation.amount}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gray-secondary">
                {donation.createdAt}
              </p>
            </div>
          </div>
        </div>
      )): <DonationSkeleton/>}
    </div>
  );
};

export default Donations;
