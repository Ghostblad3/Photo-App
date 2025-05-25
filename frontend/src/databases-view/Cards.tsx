import { useState } from 'react';
import { Switch } from '../components/ui/switch';
import { Card } from './Card';
import { useSelectedTableInfoStore } from './stores/selectedTableInfoStore';

function Cards() {
  const [showCards, setShowCards] = useState(false);
  const columnNames = useSelectedTableInfoStore(
    (state) => state.props.columnNames
  );
  const userNumber = useSelectedTableInfoStore(
    (state) => state.props.userNumber
  );
  const screenshotNumber = useSelectedTableInfoStore(
    (state) => state.props.screenshotNumber
  );
  const screenshotAverageSize = useSelectedTableInfoStore(
    (state) => state.props.screenshotAverageSize
  );

  return (
    <>
      <div className="my-2 flex items-center gap-2.5 pl-2.5">
        <Switch
          id="airplane-mode"
          onCheckedChange={() => setShowCards((prev) => !prev)}
        />
        <p className="font-semibold">Show table information</p>
      </div>
      {showCards && (
        <div className="grid auto-rows-fr gap-5 p-2.5 lg:grid-cols-4">
          {columnNames.length !== 0 && (
            <>
              <Card>
                <span className="mb-5 text-center text-xl">
                  User properties
                </span>
                {columnNames.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </Card>
              <Card>
                <span className="mb-5 text-center text-xl">User number</span>
                <p>{userNumber}</p>
              </Card>
              <Card>
                <span className="mb-5 text-center text-xl">
                  Screenshot number
                </span>
                <p>{screenshotNumber}</p>
              </Card>
              <Card>
                <span className="mb-5 text-center text-xl">
                  Average screenshot size
                </span>
                <p>
                  {`${(parseFloat(screenshotAverageSize) * 0.001).toFixed(2)}`}
                  {' KB'}
                </p>
              </Card>
            </>
          )}
        </div>
      )}
    </>
  );
}

export { Cards };
