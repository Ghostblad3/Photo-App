import { useState } from "react";
import { Switch } from "../components/ui/switch";
import Card from "./Card";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";

function Cards() {
  const [showCards, setShowCards] = useState(true);
  const columnNames = selectedTableInfoStore(
    (state) => state.props.columnNames
  );
  const userNumber = selectedTableInfoStore((state) => state.props.userNumber);
  const screenshotNumber = selectedTableInfoStore(
    (state) => state.props.screenshotNumber
  );
  const screenshotAverageSize = selectedTableInfoStore(
    (state) => state.props.screenshotAverageSize
  );

  return (
    <>
      <div className="my-2 pl-2.5 flex items-center gap-2.5">
        <Switch
          id="airplane-mode"
          onCheckedChange={() => setShowCards((prev) => !prev)}
        />
        <p className="font-semibold">Show table information</p>
      </div>
      {showCards && (
        <div className="grid lg:grid-cols-4 gap-5 auto-rows-fr p-2.5">
          {columnNames.length !== 0 && (
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
          )}
        </div>
      )}
    </>
  );
}

export default Cards;
