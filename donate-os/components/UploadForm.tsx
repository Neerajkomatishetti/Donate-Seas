"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useState } from "react";
import TotalDonations from "./TotalDonations";

type formTypes = {
    username?:string,
    Amount:number,
    imgURL?:File | null
}

export const UploadForm = () => {
  const router = useRouter();
  const [donateWithName, setDonateWithName] = useState(false);
  const [donations, setDonations] = useState(6000);
  const [formData, setFormData] = useState<formTypes>({
    Amount:0
  })

  const handleSubmit = () => {
    router.push("/DonationStatus"); // navigate
  };

  return (
    <div>
      <TotalDonations totalDonations={donations} />  
      <div className="flex justify-center p-5 w-full">
        <div
          className="[&>*]:my-3 w-[80vw] md:w-[35vw]"
        >
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
              <Input name="username" id="username" type="string" value={formData.username} onChange={(e) =>{
                setFormData({
                    ...formData,
                    username:e.target.value
                })
              }} />
            </>
          )}
          <Label htmlFor="Amount">Amount</Label>
          <Input name="Amount" id="Amount" type="number" onChange={(e) => {
            setFormData({
                ...formData,
                Amount:e.target.valueAsNumber
            })
          }} />
          <Input className="bg-secondary" name="Upload" id="Upload" type="file" onChange={(e) => {
            setFormData({
                ...formData,
                imgURL:e.target.files?.[0]?? null
            })
          }} />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </div>
    </div>
  );  
};

export default UploadForm;
