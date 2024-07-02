import { useState } from "react";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import Card from "./Card";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";

function Cards() {
  const [showCards, setShowCards] = useState(true);
  const { selectedTableInfo } = selectedTableInfoStore();

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
          {selectedTableInfo.columnNames.length !== 0 ? (
            <>
              <Card>
                <span className="text-center text-xl mb-5">
                  User properties
                </span>
                {selectedTableInfo.columnNames.map((item) => (
                  <Label key={item}>{item}</Label>
                ))}
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">User number</span>
                <Label>{selectedTableInfo.userNumber}</Label>
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">
                  Screenshot number
                </span>
                <Label>{selectedTableInfo.screenshotNumber}</Label>
              </Card>
              <Card>
                <span className="text-center text-xl mb-5">
                  Average screenshot size
                </span>
                <Label>
                  {`${(
                    parseFloat(selectedTableInfo.screenshotAverageSize) * 0.001
                  ).toFixed(2)}`}
                  {" KB"}
                </Label>
              </Card>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default Cards;
