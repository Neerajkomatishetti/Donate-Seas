"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button";
import axios from "axios";

export const AccountUpdateCpnt = () => {
    return <>
    <div className="flex w-full h-full items-center justify-center">
        <div className="flex flex-col w-[80%] md:w-[40%] h-fit px-2 py-3 [&>*]:my-2 bg-secondary rounded-lg ">
            <Label>Accoount</Label>
            <Input/>
            <Label>Account Number</Label>
            <Input/>
            <Label>Bank Name</Label>
            <Input/>
            <Label>IFSC</Label>
            <Input/>
            <Button onClick={async () =>{
                const response = await axios.put('/account/') //TODO_ACC
            }}>Submit</Button>
        </div>
    </div>
    </>
}

export default AccountUpdateCpnt;