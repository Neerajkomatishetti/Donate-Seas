"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";
import {
  User,
  DollarSign,
  Upload,
  Send,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

const supabaseUrl = "https://lhqzpzeqqvpvmnrobtfr.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type formTypes = {
  username?: string;
  Amount: number;
  imgURL?: File | null;
};

export const UploadForm = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [donateWithName, setDonateWithName] = useState(false);
  const [formData, setFormData] = useState<formTypes>({
    Amount: 0,
  });
  const [pending, setPending] = useState(false);

  async function uploadFile(file: File) {
    const fileExt = file.name.split(".").pop();
    const filePath = `donations/${uuidv4()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("donations")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("donations")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  const handleSubmit = async () => {
    if (!formData.imgURL) {
      alert("Please upload a proof of donation screenshot.");
      return;
    }

    setPending(true);
    let uploadedUrl: string | null = null;

    try {
      uploadedUrl = await uploadFile(formData.imgURL);
      if (!uploadedUrl) {
        setPending(false);
        alert(
          "Failed to upload the image. Please check your internet connection and try again.",
        );
        return;
      }
    } catch (err) {
      setPending(false);
      console.error("Critical upload error:", err);
      alert(
        "A network error occurred during image upload. The connection might have timed out.",
      );
      return;
    }

    try {
      const timestamp = Date.now();
      const dateObj = new Date(timestamp);
      const createdAt = dateObj.toLocaleDateString();

      const response = await axios.post(
        `${BACKEND_URL}/donate`,
        {
          name: formData.username || "Anonymous",
          amount: formData.Amount,
          imgurl: uploadedUrl,
          status: "PENDING",
          createdAt: createdAt,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (response.data) {
        setPending(false);
        router.push("/DonationStatus");
      } else {
        setPending(false);
        alert("Error occurred during donation submission!");
      }
    } catch (err) {
      setPending(false);
      console.error("Submission error:", err);
      alert("Failed to submit donation to the server.");
    }
  };

  return (
    <div className="py-4 flex justify-center w-full px-4 min-h-screen items-center">
      <div className="w-full max-w-lg bg-background/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Make a Donation
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Your contribution helps us keep the seas clean and blue.
            </p>
          </div>

          <div className="space-y-4">
            <RadioGroup
              defaultValue="Anonymous"
              className="flex justify-center gap-6 bg-secondary/30 p-1.5 rounded-2xl border border-white/5"
            >
              <div className="flex items-center space-x-2 cursor-pointer group/radio">
                <RadioGroupItem
                  value="Anonymous"
                  id="Anonymous"
                  className="w-4 h-4"
                  onClick={() => setDonateWithName(false)}
                />
                <Label
                  htmlFor="Anonymous"
                  className="text-sm font-medium cursor-pointer group-hover/radio:text-primary transition-colors"
                >
                  Anonymous
                </Label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer group/radio">
                <RadioGroupItem
                  value="Name"
                  id="Name"
                  className="w-4 h-4"
                  onClick={() => setDonateWithName(true)}
                />
                <Label
                  htmlFor="Name"
                  className="text-sm font-medium cursor-pointer group-hover/radio:text-primary transition-colors"
                >
                  With Name
                </Label>
              </div>
            </RadioGroup>

            {donateWithName && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 ml-1">
                  <User size={14} className="text-primary" />
                  <Label htmlFor="username">Your Name</Label>
                </div>
                <Input
                  name="username"
                  id="username"
                  placeholder="Enter your name"
                  className="bg-white/5 border-white/10 h-10 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      username: e.target.value ?? "Anonymous",
                    });
                  }}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/80 ml-1">
                <DollarSign size={14} className="text-primary" />
                <Label htmlFor="Amount">Donation Amount</Label>
              </div>
              <div className="relative">
                <Input
                  name="Amount"
                  id="Amount"
                  type="number"
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 h-10 rounded-xl pl-9 focus:ring-2 focus:ring-primary/50 transition-all text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      Amount: e.target.valueAsNumber,
                    });
                  }}
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/80 ml-1">
                <Upload size={14} className="text-primary" />
                <Label htmlFor="Upload">Proof of Donation</Label>
              </div>
              <div className="relative group/upload">
                <input
                  type="file"
                  id="Upload"
                  className="hidden"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      imgURL: e.target.files?.[0] ?? null,
                    });
                  }}
                />
                <label
                  htmlFor="Upload"
                  className="flex flex-col items-center justify-center w-full min-h-24 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group-hover/upload:border-primary/50"
                >
                  {formData.imgURL ? (
                    <div className="flex items-center gap-3 text-primary animate-in zoom-in duration-300">
                      <CheckCircle2 size={20} />
                      <span className="font-medium truncate max-w-[200px] text-sm">
                        {formData.imgURL.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon size={24} className="opacity-50" />
                      <p className="text-xs">Click to upload screenshot</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:scale-100 group/btn overflow-hidden relative"
              disabled={pending}
              onClick={() => {
                handleSubmit();
              }}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {pending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send
                      size={16}
                      className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                    />
                    <span>Complete Donation</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-100 group-hover:opacity-90 transition-opacity" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
