import { Alert } from './global-components/Alert';
import { useOperationStore } from './global-stores/operationStore';

function Alerts() {
  const showQueue = useOperationStore((state) => state.props.showQueue);

  return (
    <div className="fixed bottom-4 right-10 z-50 ml-5 w-[calc(100%-3.25rem)] md:w-80">
      {showQueue.map((item) => (
        <div key={item.hash}>
          <Alert item={item} />
        </div>
      ))}
    </div>
  );
}

export { Alerts };
