"use client";

import React, { useState, useEffect } from "react";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { User, Wallet, Calendar, CheckCircle2, Clock } from "lucide-react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type DonationProps = {
  id: string;
  name: string;
  amount: number;
  imgurl: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

export default function DonateCircular() {
  const [donations, setDonations] = useState<DonationProps[]>([]);
  const { token } = useAuth();
  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    const fetchdonations = () => {
      if (token) {
        axios
          .get(`${BACKEND_URL}/carousal`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            setDonations(response.data.topDonations);
          });
      }
    };
    fetchdonations();
    return;
  }, [token]);

  const productTemplate = (donation: DonationProps) => {
    return (
      <div className="px-2 py-4">
        <div className="relative group overflow-hidden rounded-2xl border border-black/[0.03] dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {donation.name || "Anonymous Donor"}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  {donation.createdAt || "Recent"}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Amount
                </span>
                <div className="flex items-center gap-1.5 text-primary">
                  <Wallet className="w-4 h-4" />
                  <span className="text-lg font-black tracking-tight">
                    ₹{donation.amount}
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  donation.status === "ACCEPTED"
                    ? "bg-green-500/10 text-green-600 border border-green-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                {donation.status === "ACCEPTED" ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" /> Pending
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card w-full max-w-[900px]">
      <Carousel
        value={donations}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        className="custom-carousel"
        circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
        showIndicators={false}
      />
    </div>
  );
}
