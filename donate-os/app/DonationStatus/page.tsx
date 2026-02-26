"use client";

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "primereact/image";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { SquareCheck } from "lucide-react";
import TotalDonations from "@/components/TotalDonations";
import { DonationSkeleton } from "@/components/DonationSkeletons";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type TransactionProps = {
  id: string;
  amount: number;
  imgurl: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

export const DonationStatus = () => {
  const router = useRouter();
  const { isLoggedIn, loading, token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [userDonations, setUserDonations] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchDonations = useCallback(async () => {
    const response = await axios.get(`${BACKEND_URL}/donate/mydonations`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }, [token]);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("Please login!");
      router.push("/");
    }

    axios
      .get(`${BACKEND_URL}/me`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUserDonations(response.data.user.userDonations);
      });

    if (!isDataLoaded && isLoggedIn) {
      setTimeout(() => {
        fetchDonations().then((data) => {
          setDonations(data.donations);
          setIsDataLoaded(true);
        });
      }, 2000);
    }
  }, [loading, isLoggedIn, isDataLoaded, fetchDonations, router, token]);

  return (
    <>
      <div className="flex flex-col w-full h-auto overflow-y-scroll hide-scrollbar items-center mt-5 px-3">
        <div className="w-full md:max-w-[40%]">
          <TotalDonations totalDonations={userDonations} />
        </div>

        <div className="flex justify-between w-full md:max-w-[40%] h-fit">
          <h1 className="flex items-center text-lg font-bold">Donations</h1>
          <Button
            className="bg-green-600"
            variant="greenButton"
            onClick={() => {
              router.push("/Donate");
            }}
          >
            New Donation
          </Button>
        </div>
        {isDataLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full md:max-w-[85%] lg:max-w-[85%] mt-8 pb-10">
            {donations.map((donation: TransactionProps, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Image Section */}
                <div className="relative aspect-video sm:aspect-[16/10] w-full overflow-hidden bg-muted max-h-[180px] sm:max-h-none">
                  <Image
                    src={donation.imgurl}
                    alt={`Donation of ${donation.amount}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    preview
                    loading="lazy"
                    downloadable
                  />
                  {/* Floating Amount Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10">
                      <p className="text-sm font-bold text-white tracking-tight">
                        ₹{donation.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-4 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      <div className="h-1 w-1 rounded-full bg-primary/40 animate-pulse" />
                      {donation.createdAt}
                    </div>

                    {donation.status === "PENDING" ? (
                      <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 border border-amber-500/10 text-amber-500">
                        <SquareCheck className="h-2.5 w-2.5 opacity-50" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          Pending
                        </span>
                      </div>
                    ) : donation.status === "REJECTED" ? (
                      <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 border border-red-500/10 text-red-500">
                        <SquareCheck className="h-2.5 w-2.5 opacity-50 rotate-180" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          Rejected
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/10 text-emerald-500">
                        <SquareCheck className="h-2.5 w-2.5" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  <div className="flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-muted-foreground">
                      Evidence
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] hover:bg-white/5 px-2"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full md:max-w-[85%] lg:max-w-[85%] mt-8 pb-10">
            <DonationSkeleton />
          </div>
        )}
        {donations.length === 0 && isDataLoaded && (
          <p className="text-center w-full">No donations found</p>
        )}
      </div>
    </>
  );
};

export default DonationStatus;
