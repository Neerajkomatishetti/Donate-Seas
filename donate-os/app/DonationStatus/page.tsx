"use client";

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "primereact/image";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { CheckIcon, CrossIcon, SquareCheck, TicketCheckIcon, X} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type TransactionProps = {
  amount: number;
  imgurl: string;
  Status: boolean;
  createdAt: string;
};

export const DonationStatus = () => {
  const router = useRouter();
  const { isLoggedIn, loading, token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetch = async () => {
    const response = await axios.get(`${BACKEND_URL}/donate/mydonations`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("Please login!");
      router.push("/");
    }

    // Only fetch if data hasn't been loaded yet
    if (!isDataLoaded && isLoggedIn) {
      fetch().then((data) => {
        setDonations(data.donations);
        setIsDataLoaded(true);
        console.log(donations);
      });
    }
  }, [loading, isLoggedIn, isDataLoaded]);

  useEffect(() => {});

  return (
    <>
      <div className="flex flex-col w-full h-auto overflow-y-scroll hide-scrollbar items-center mt-5 px-3">
        <div className="flex justify-between w-full md:max-w-[40%] h-fit">
          <h1 className="flex items-center text-lg font-bold">Donations</h1>
          <Button
            variant="greenButton"
            onClick={() => {
              router.push("/Donate");
            }}
          >
            New Donation
          </Button>
        </div>
        {donations.map((donation: TransactionProps, idx) => (
          <div
            key={idx}
            className="flex flex-col px-4 py-2 w-full md:w-[40%] border my-3 rounded-lg bg-secondary"
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
            <div className="flex px-4 py-2 justify-between w-full">
              <div>
                <h3 className="font-bold">Amount:</h3>
                <p className="font-mono text-sm"> ₹{donation.amount}</p>
              </div>
              <div>
                {!donation.Status? <p className="pb-2 flex">
                  <X color="#b12006" strokeWidth={2.75} />"Pending"
                </p>
                : <p className="flex pb-2">
                  <SquareCheck color="white" strokeWidth={2.75} fill="#1bd051" />"Verified"
                </p>}
                <p className="font-mono text-xs text-gray-secondary">
                  {donation.createdAt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonationStatus;
