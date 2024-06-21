import { create } from "zustand";

type Status = "nop" | "pending" | "success" | "error";
type Operation = "nop" | "create" | "update" | "delete";

interface ModifyOperation {
  status: Status;
  operation: Operation;
  setStatus: (status: Status) => void;
  setOperation: (operation: Operation) => void;
  resetModifyOpeation: () => void;
}

const modifyOperationStore = create<ModifyOperation>((set) => ({
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
  resetModifyOpeation: () => set({ status: "nop" }),
}));

export default modifyOperationStore;
