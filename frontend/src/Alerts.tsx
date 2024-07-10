import Alert from "./global-components/Alert";
import operationStore from "./global-stores/operationStore";

function Alerts() {
  const showQueue = operationStore((state) => state.props.showQueue);

  return (
    <div className="fixed bottom-4 ml-5 right-5 z-50 w-[calc(100%-2.50rem)] md:w-[15.625rem]">
      {showQueue.map((item) => (
        <div key={item.hash}>
          <Alert item={item} />
        </div>
      ))}
    </div>
  );
}

export default Alerts;
