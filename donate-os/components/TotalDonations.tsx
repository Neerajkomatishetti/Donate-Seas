import { SquareCheck } from "lucide-react";

type Props = {
  totalDonations: number;
};

const TotalDonations = ({ totalDonations }: Props) => {
  return (
    <div className="flex w-full bg-background md:p-0 mb-6 group">
      <div className="flex w-full items-center justify-between bg-white/5 backdrop-blur-xl p-6 shadow-2xl border border-white/10 rounded-2xl transition-all hover:bg-white/10">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
            Total Contributions
          </h2>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tighter">
              ₹{totalDonations.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              INR
            </span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
          <SquareCheck className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default TotalDonations;
