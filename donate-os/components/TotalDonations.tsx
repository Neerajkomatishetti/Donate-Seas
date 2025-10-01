type Props = {
    totalDonations:number
  }


const TotalDonations = ({totalDonations}:Props) => {
    return (
      <div className="flex w-full border p-3 border-b">
        <div className="flex w-fit h-fit p-2 shadow border rounded-md">
          <h2 className="font-bold px-2">Total Donations:</h2>
          <p>{totalDonations}/-</p>
        </div>
      </div>
    );
}

export default TotalDonations;