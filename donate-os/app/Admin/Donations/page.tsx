"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type DonationProps = {
  id: string;
  name: string;
  amount: number;
  imgurl: string;
  Status: string;
  createdAt: string;
};

type TokenPayload = {
  id: string;
  name: string;
};

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${BACKEND_URL}/donate/bulk`, {
        headers:{
          Authorization:token 
      }})
      .then((response) => {
        setDonations(response.data.donations);
      });
  }, []);
  return (
    <div className="flex flex-col w-full h-full px-5">
      <p className="flex w-full justify-center text-red-700">
        this will not be accessable by users in the future only admins are
        allowed!
      </p>
      {donations.map((donation: DonationProps) => (
        <div
          key={donation.id}
          className="flex flex-col px-4 p-2 w-full border my-2 bg-secondary rounded-lg"
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
              onClick={() => {
                axios.put(`${BACKEND_URL}/donate/Approve`,{
                  data:{
                    id:donation.id
                  }
                }, {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                });
              }}
              className="h-6 mb-2 px- hover:cursor-pointer"
            >
              Approve
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
      ))}
    </div>
  );
};

export default Donations;
