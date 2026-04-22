import WdogBreadClum from "@/components/WdogBreadClum";
import HistoryContentMain from "@/sections/HistoryContentMain";

export default function HistoryContent() {
  return (
        
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="HistoryContent"/> 
      </div>
      <HistoryContentMain/>
    </div>
  );
}