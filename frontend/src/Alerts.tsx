import Alert from "./global-components/Alert";
import operationStore from "./global-stores/operationStore";

function Alerts() {
  const showQueue = operationStore((state) => state.props.showQueue);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showQueue.map((item) => (
        <div key={item.hash}>
          <Alert item={item} />
        </div>
      ))}
    </div>
  );
}

export default Alerts;
