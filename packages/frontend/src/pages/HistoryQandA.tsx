import WdogBreadClum from "@/components/WdogBreadClum";
import HistoryQandAMain from "@/sections/HistoryQandAMain";

export default function HistoryQandA() {    
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="HistoryQandA"/> 
      </div>
      <div className="flex gap-4 w-full">
        <HistoryQandAMain />
      </div>     
    </div>
  );
}