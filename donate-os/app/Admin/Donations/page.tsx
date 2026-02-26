"use client";

import { DonationSkeleton } from "@/components/DonationSkeletons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "primereact/image";
import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  Wallet,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type DonationProps = {
  id: string;
  name: string;
  amount: number;
  imgurl: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

const Donations = () => {
  const [donations, setDonations] = useState<DonationProps[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED">(
    "PENDING",
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchdonations = useCallback(
    async (isLoadMore = false) => {
      if (!token) return;

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      try {
        const response = await axios.get(`${BACKEND_URL}/donate/bulk`, {
          params: {
            status,
            take: 6,
            cursor: isLoadMore ? nextCursor : undefined,
          },
          headers: {
            Authorization: token,
          },
        });

        if (isLoadMore) {
          setDonations((prev) => [...prev, ...response.data.donations]);
        } else {
          setDonations(response.data.donations);
        }
        setNextCursor(response.data.nextCursor);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token, status, nextCursor],
  );

  useEffect(() => {
    fetchdonations();
  }, [status, fetchdonations]);

  const handleAction = async (id: string, action: "Approve" | "Reject") => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/donate/${action}`,
        {
          data: {
            id: id,
          },
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (response.status === 200) {
        // Refresh the list
        fetchdonations();
      }
    } catch (error) {
      console.error(`Error ${action}ing donation:`, error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center min-h-[90vh] px-4 pb-20">
      <div className="w-full max-w-7xl pt-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Donations Management
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Monitor and process incoming contributions from the community.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-black/[0.03] dark:bg-white/5 backdrop-blur-md rounded-2xl border border-black/[0.03] dark:border-white/10 w-full max-w-md">
          {(["PENDING", "ACCEPTED", "REJECTED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setDonations([]);
                setNextCursor(null);
              }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                status === s
                  ? "bg-white dark:bg-white/10 shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>

        {loading && donations.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4 h-[400px] hide-scrollbar overflow-scroll ">
            <DonationSkeleton />
          </div>
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              No donations found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
              {donations.map((donation: DonationProps) => (
                <div
                  key={donation.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/[0.03] dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-black/5 dark:bg-white/5">
                    <Image
                      src={donation.imgurl}
                      alt={donation.name || "Donation"}
                      width="100%"
                      height="100%"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      preview
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                          donation.status === "ACCEPTED"
                            ? "bg-green-500/20 text-green-600 border-green-500/30"
                            : donation.status === "REJECTED"
                              ? "bg-red-500/20 text-red-600 border-red-500/30"
                              : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                        }`}
                      >
                        {donation.status === "ACCEPTED" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : donation.status === "REJECTED" ? (
                          <ShieldCheck className="w-3.5 h-3.5 rotate-180" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {donation.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col p-6 gap-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary">
                          <User className="w-4 h-4" />
                          <h2 className="font-black text-lg tracking-tight text-slate-900 dark:text-white truncate max-w-[150px]">
                            {donation.name || "Anonymous Donor"}
                          </h2>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {donation.createdAt}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                          Contribution
                        </span>
                        <div className="flex items-center gap-1 text-primary">
                          <Wallet className="w-4 h-4" />
                          <span className="font-mono font-black text-xl tracking-tighter">
                            ₹{donation.amount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(donation.id, "Approve")}
                          className="flex-1 h-10 rounded-xl font-bold bg-gray-800 text-green-500 hover:bg-green-500/5 active:scale-[0.98] text-xs"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleAction(donation.id, "Reject")}
                          className="px-3 h-10 rounded-xl font-bold bg-gray-800 text-red-500 hover:bg-red-500/5 active:scale-[0.98] text-xs"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {status !== "PENDING" && (
                      <div className="w-full h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center gap-2 text-muted-foreground font-bold italic text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Handled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {nextCursor && (
              <Button
                onClick={() => fetchdonations(true)}
                disabled={loadingMore}
                variant="outline"
                className="mt-12 h-10 px-6 rounded-xl border-black/[0.05] dark:border-white/10 font-bold flex items-center gap-2 hover:bg-black/[0.02] dark:hover:bg-white/5 text-xs"
              >
                {loadingMore ? (
                  <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>Load More</>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Donations;
