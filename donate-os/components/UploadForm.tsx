"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import TotalDonations from "./TotalDonations";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { useAuth } from "./AuthContext";

const supabaseUrl = "https://gekzkmggkbzsqzhglmgw.supabase.co";
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
  const [donations, setDonations] = useState(6000);
  const [formData, setFormData] = useState<formTypes>({
    Amount: 0,
  });

  async function uploadFile(file: File) {
    const fileExt = file.name.split(".").pop();
    const filePath = `donations/${uuidv4()}.${fileExt}`;
    console.log(filePath);

    const { error } = await supabase.storage
      .from("Images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    // get public URL
    const { data: publicUrlData } = supabase.storage
      .from("Images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  const handleSubmit = async () => {
    let uploadedUrl: string | null = null;

    if (formData.imgURL) {
      uploadedUrl = await uploadFile(formData.imgURL);
    }

    const timestamp = Date.now();
    const dateObj = new Date(timestamp);
    const createdAt = dateObj.toLocaleDateString();

    console.log(createdAt);

    const response = await axios.post(
      `${BACKEND_URL}/donate`,
      {
        name: formData.username,
        amount: formData.Amount,
        imgurl: uploadedUrl,
        Status: false,
        createdAt: createdAt,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data) {
      router.push("/DonationStatus");
    } else {
      alert("error occured during uploading the image!");
    }
  };

  return (
    <div className="py-3">
      <TotalDonations totalDonations={donations} />
      <div className="flex justify-center p-5 w-full">
        <div className="[&>*]:my-3 w-[80vw] md:w-[35vw] bg-secondary p-4 rounded-lg">
          <RadioGroup defaultValue="Anonymous" className="flex mb-3">
            <div id="AN" className="flex items-center space-x-2">
              <RadioGroupItem
                value="Anonymous"
                id="Anonymous"
                onClick={() => {
                  setDonateWithName(false);
                }}
              />
              <Label htmlFor="Anonymous">Anonymous</Label>
            </div>
            <div id="NM" className="flex items-center space-x-2">
              <RadioGroupItem
                value="Name"
                id="Name"
                onClick={() => {
                  setDonateWithName(true);
                }}
              />
              <Label htmlFor="Name">Name</Label>
            </div>
          </RadioGroup>
          {donateWithName && (
            <>
              <Label htmlFor="username">Name</Label>
              <Input
                name="username"
                id="username"
                type="string"
                value={formData.username}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    username: e.target.value ?? "Anonymous",
                  });
                }}
              />
            </>
          )}
          <Label htmlFor="Amount">Amount</Label>
          <Input
            name="Amount"
            id="Amount"
            type="number"
            onChange={(e) => {
              setFormData({
                ...formData,
                Amount: e.target.valueAsNumber,
              });
            }}
          />
          <Input
            className="bg-primary/5"
            name="Upload"
            id="Upload"
            type="file"
            onChange={(e) => {
              setFormData({
                ...formData,
                imgURL: e.target.files?.[0] ?? null,
              });
            }}
          />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
