import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import Image from "next/image";

export default function Welcome() {
    const router = useRouter();
    return (
        <div className="flex w-full flex-col items-center  h-full  [&>*]:my-2 ">
 
            <Image src="/DonateOs_Banner.png" width={380} height={100} priority={true} className="w-auto max-h-[50%] mask-x-from-90%" alt="Banner" />
            <h1 className="text-2xl font-bold">Welcome to DonateOS</h1>
            <p className="text-sm text-gray-500">DonateOS is a platform for donating to charities OverSeas</p>
            <Button variant="greenButton" onClick={() => {
                router.push("/Donate");
            }}>Donate</Button>
        </div>
    )
}