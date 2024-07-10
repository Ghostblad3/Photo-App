import { create } from "zustand";

type Status = "nop" | "pending" | "success" | "error";
type Operation = "nop" | "fetch" | "create" | "update" | "delete";

export type OperationObject = {
  hash: string;
  status: Status;
  operation: Operation;
  message: string;
};

interface OperationStoreProps {
  props: {
    operations: OperationObject[];
    showQueue: OperationObject[];
  };
}

interface OperationStoreActions {
  actions: {
    addOperation: (
      hash: string,
      status: Status,
      operation: Operation,
      message: string,
      show: boolean
    ) => void;
    changeOperationStatus: (
      hash: string,
      status: Status,
      message: string,
      show: boolean
    ) => void;
    removeOperation: (hash: string) => void;
    resetOperationStore: () => void;
  };
}

const initProps: {
  operations: OperationObject[];
  showQueue: OperationObject[];
} = {
  operations: [],
  showQueue: [],
};

const operationStore = create<OperationStoreProps & OperationStoreActions>(
  (set) => ({
    props: initProps,
    actions: {
      addOperation(hash, status, operation, message, show) {
        set((state) => ({
          props: {
            ...state.props,
            operations: [
              ...state.props.operations,
              { hash, status, operation, message },
            ],
            showQueue: show
              ? [...state.props.showQueue, { hash, status, operation, message }]
              : state.props.showQueue,
          },
        }));
      },
      changeOperationStatus(hash, status, message, show) {
        set((state) => ({
          props: {
            operations: state.props.operations.map((item) => {
              if (item.hash === hash) {
                return {
                  ...item,
                  status,
                  message,
                };
              }

              return item;
            }),
            showQueue: state.props.showQueue.some((item) => item.hash === hash)
              ? state.props.showQueue.map((item) =>
                  item.hash === hash ? { ...item, status, message } : item
                )
              : show
              ? [
                  ...state.props.showQueue,
                  {
                    hash,
                    status,
                    operation: state.props.operations.find(
                      (item) => item.hash === hash
                    )!.operation,
                    message,
                  },
                ]
              : state.props.showQueue,
          },
        }));
      },
      removeOperation(hash) {
        set((state) => ({
          props: {
            operations: state.props.operations.filter(
              (item) => item.hash !== hash
            ),
            showQueue: state.props.showQueue.filter(
              (item) => item.hash !== hash
            ),
          },
        }));
      },
      resetOperationStore: () => set({ props: initProps }),
    },
  })
);

export default operationStore;
