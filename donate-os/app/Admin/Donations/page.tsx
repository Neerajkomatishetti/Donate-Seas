import { Button } from "@/components/ui/button";

type TransactionProps = {
    Name:string
    Amount: number;
    Status: string;
    Date: string;
  };
  
  const Transactions: TransactionProps[] = [
    {
      Name:"",
      Amount: 6000,
      Status: "Pending",
      Date: "12-05-2025",
    },{
        Name:"Neeraj",
        Amount: 6000,
        Status: "Pending",
        Date: "12-05-2025",
      },{
        Name:"Ravi",
        Amount: 6000,
        Status: "Pending",
        Date: "12-05-2025",
      },{
        Name:"Rohith",
        Amount: 6000,
        Status: "Pending",
        Date: "12-05-2025",
      },{
        Name:"Jeevan",
        Amount: 6000,
        Status: "Pending",
        Date: "12-05-2025",
      }

  ];


const Donations = () =>{
    return (
      <div className="flex flex-col w-full h-full px-5">
        <p className="flex w-full justify-center text-red-700">this will not be accessable by users in the future only admins are allowed!</p>
        {Transactions.map((transaction: TransactionProps, idx) => (
          <div
            key={idx}
            className="flex flex-col px-4 p-2 w-full border my-2 shadow-lg shadow-secondary rounded-lg"
          >
            <div className="border-b mb-2">
                <h2 className="font-bold text-lg px-2">{transaction.Name || "Anonymous"}</h2>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <h3 className="font-bold text-gray-500 px-2">Amount:</h3>
                <p className="font-mono text-sm"> ₹{transaction.Amount}</p>
              </div>
              <div>
                <Button className="h-6 mb-2 px- hover:cursor-pointer">Approve</Button>
                <p className="font-mono text-xs text-gray-secondary">
                  {transaction.Date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}

export default Donations;