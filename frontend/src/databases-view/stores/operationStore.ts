import { create } from "zustand";

type Status = "nop" | "pending" | "success" | "error";
type Operation = "nop" | "create" | "update" | "delete";

interface OperationStore {
  status: Status;
  operation: Operation;
  setStatus: (status: Status) => void;
  setOperation: (operation: Operation) => void;
  resetOperationStore: () => void;
}

const operationStore = create<OperationStore>((set) => ({
  status: "nop",
  operation: "nop",
  setStatus: (status) =>
    set(() => ({
      status: status,
    })),
  setOperation: (operation) =>
    set(() => ({
      operation: operation,
    })),
  resetOperationStore: () => set({ status: "nop", operation: "nop" }),
}));

export default operationStore;
