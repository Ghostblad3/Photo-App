import { create } from "zustand";

type Status = "nop" | "pending" | "success" | "error";
type Operation = "nop" | "fetch" | "create" | "update" | "delete";
export type OperationObject = {
  hash: string;
  status: Status;
  operation: Operation;
  message: string;
};

interface OperationStore {
  operations: OperationObject[];
  showQueue: OperationObject[];
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
    message: string
  ) => void;
  removeOperation: (hash: string) => void;
  resetOperationStore: () => void;
}

const operationStore = create<OperationStore>((set) => ({
  operations: [],
  showQueue: [],
  addOperation(hash, status, operation, message, show) {
    set((state) => ({
      operations: [...state.operations, { hash, status, operation, message }],
      showQueue: show
        ? [...state.showQueue, { hash, status, operation, message }]
        : state.showQueue,
    }));
  },
  changeOperationStatus(hash, status, message) {
    set((state) => ({
      operations: state.operations.map((item) => {
        if (item.hash === hash) {
          return {
            ...item,
            status,
            message,
          };
        }

        return item;
      }),
      showQueue: state.showQueue.some((item) => item.hash === hash)
        ? state.showQueue.map((item) =>
            item.hash === hash ? { ...item, status, message } : item
          )
        : [
            ...state.showQueue,
            {
              hash,
              status,
              operation: state.operations.find((item) => item.hash === hash)!
                .operation,
              message,
            },
          ],
    }));
  },
  removeOperation(hash) {
    set((state) => ({
      operations: state.operations.filter((item) => item.hash !== hash),
      showQueue: state.showQueue.filter((item) => item.hash !== hash),
    }));
  },
  resetOperationStore: () => set({ operations: [], showQueue: [] }),
}));

export default operationStore;
