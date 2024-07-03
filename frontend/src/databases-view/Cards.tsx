import { useState } from "react";
import { Switch } from "../components/ui/switch";
import { Label } from "@/components/ui/label";
import Card from "./Card";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";

function Cards() {
  const [showCards, setShowCards] = useState(true);
  //const { selectedTableInfo } = selectedTableInfoStore();
  const { columnNames, userNumber, screenshotNumber, screenshotAverageSize } =
    selectedTableInfoStore((state) => state.props);

  return (
    <>
      <div className="my-2 pl-2.5 flex items-center gap-2.5">
        <Switch
          id="airplane-mode"
          onCheckedChange={() => setShowCards((prev) => !prev)}
        />
        <Label className="font-semibold">Show table information</Label>
      </div>
      {showCards ? (
        <div className="grid lg:grid-cols-4 gap-5 auto-rows-fr p-2.5">
          {columnNames.length !== 0 ? (
            <>
              <Card>
                <span className="text-center text-xl mb-5">
                  User properties
                </span>
                {columnNames.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">User number</span>
                <p>{userNumber}</p>
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">
                  Screenshot number
                </span>
                <p>{screenshotNumber}</p>
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">
                  Average screenshot size
                </span>
                <p>
                  {`${(parseFloat(screenshotAverageSize) * 0.001).toFixed(2)}`}
                  {" KB"}
                </p>
              </Card>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default Cards;
