import WdogBreadClum from "@/components/WdogBreadClum";
import HistoryContentMain from "@/sections/HistoryContentMain";

export default function HistoryContent() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="HistoryContent"/> 
      </div>
      <div className="flex gap-4">
        {/* <div className="w-4/5"> */}
          <HistoryContentMain/>
        {/* </div> */}
        {/* <div className="w-1/5"></div> */}
      </div>
    </div>
  );
}