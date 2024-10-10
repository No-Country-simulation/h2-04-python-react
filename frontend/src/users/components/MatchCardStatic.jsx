import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";

const MatchCardStatic = () => {
  return (
    <Card className="w-full overflow-hidden rounded-none bg-[#F3F4F5] shadow-none">
      {/* <div className="league bg-white p-2 flex items-center space-x-2 pl-4">
        <img src={leagueLogo} alt={leagueName} className="w-6 h-6" />
        <span className="text-gray-700 font-medium">{leagueName}</span>
      </div> */}
      <div className="p-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center space-y-1 flex-1">
            <img
              src="https://media.api-sports.io/football/teams/162.png"
              alt="Werder Bremen"
              className="size-12"
            />
            <span className="font-semibold text-center">Werder Bremen</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex flex-col items-center justify-around space-y-2">
              <span className="text-lg font-medium">15:30</span>
              <span className="font-semibold">FT</span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1 flex-1">
            <img
              src="https://media.api-sports.io/football/teams/160.png"
              alt="SC Freiburg"
              className="size-12"
            />
            <span className="font-semibold text-center">SC Freiburg</span>
          </div>
        </div>
        <div className="flex justify-around text-sm">
          <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
            18
          </Button>
          <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
            21
          </Button>
          <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
            13
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MatchCardStatic;
