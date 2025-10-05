"use client"

import { useAuth } from "@/components/AuthContext";
import UploadForm from "@/components/UploadForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Upload = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if(!isLoggedIn){
        alert("Please login!")
        router.push('/')
    }
  },[isLoggedIn, router])

  return (
      <UploadForm />
  );
};

export default Upload;
