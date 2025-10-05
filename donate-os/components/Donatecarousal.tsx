"use client";

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Image } from 'primereact/image';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type DonationProps = {
    name:string
    amount: number;
    imgurl: string;
    Status: boolean;
    createdAt: string;
  };

export default function DonateCircular() {
    const [donations, setDonations] = useState<DonationProps[]>([]);
    const { token } = useAuth();
    const responsiveOptions: CarouselResponsiveOption[] = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];





    useEffect(() => {
    const fetchdonations = () =>{
        if (token) {
        axios
            .get(`${BACKEND_URL}/donate/bulk`, {
            headers: {
                Authorization: token,
            },
            })
            .then((response) => {
            setDonations(response.data.donations);
            });
        }
    }
    fetchdonations();
    return;
        
    }, [setDonations]);

    const productTemplate = (donation: DonationProps) => {
        return (
            <div className="flex flex-col w-full justify-center border-1 surface-border border-round m-2 text-center py-5 px-3">
            {/* <div className="card flex justify-center max-h-[30vh] overflow-clip ">
              <Image
                src={donation.imgurl}
                alt="Image"
                width="full"
                preview
                loading="lazy"
                downloadable
              />
            </div> */}
                <div>
                    <h4 className="mb-1">{donation.name?? "Anonymous"}</h4>
                    <h6 className="mt-0 mb-3">${donation.amount}</h6>
                    <Tag value={donation.Status}></Tag>
                </div>
            </div>
        );
    };
    
    return (
        <div className="card w-full max-w-[900px]">
            <Carousel value={donations} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} className="custom-carousel" circular
            autoplayInterval={3000} itemTemplate={productTemplate} showIndicators={false} />
        </div>
    )
}