import { AlertCircle, Check, Loader } from 'lucide-react';
import { OperationObject } from '../global-stores/operationStore';

const bgColor = {
  success: 'rgb(237, 247, 237)',
  error: 'rgb(253, 237, 237)',
  pending: 'rgb(229, 246, 253)',
};

const txtColor = {
  success: 'rgb(30, 70, 32)',
  error: 'rgb(95, 33, 32)',
  pending: 'rgb(1, 67, 97)',
};

const iconColor = {
  success: 'rgb(46, 125, 50)',
  error: 'rgb(211, 47, 47)',
  pending: 'rgb(2, 136, 209)',
};

function Alert({ item }: { item: OperationObject }) {
  return (
    <div
      className="animate-fade-in m-2.5 flex w-full justify-center rounded-lg p-1.5 pb-2.5"
      style={{
        backgroundColor:
          item.status === 'pending'
            ? bgColor['pending']
            : item.status === 'success'
              ? bgColor['success']
              : bgColor['error'],
        color:
          item.status === 'pending'
            ? txtColor['pending']
            : item.status === 'success'
              ? txtColor['success']
              : txtColor['error'],
      }}
    >
      <div
        className="ml-2 mr-3.5 mt-1.5"
        style={{
          color:
            item.status === 'pending'
              ? iconColor['pending']
              : item.status === 'success'
                ? iconColor['success']
                : iconColor['error'],
        }}
      >
        {item.status === 'success' && <Check className="size-5" />}
        {item.status === 'error' && <AlertCircle className="size-5" />}
        {item.status === 'pending' && (
          <Loader className="size-5 animate-spin" />
        )}
      </div>
      <div className="flex w-full flex-col">
        <div className="mt-[0.144rem]">
          {item.operation === 'update' && 'Update'}
          {item.operation === 'delete' && 'Delete'}
          {item.operation === 'create' && 'Create'}
          {item.operation === 'fetch' && 'Fetching'}
        </div>
        <div className="mb-1 mr-2 mt-2 w-full">{item.message}</div>
      </div>
    </div>
  );
}

export { Alert };
