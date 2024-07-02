import { AlertCircle, Check, Loader } from "lucide-react";
import { OperationObject } from "../global-stores/operationStore";

const bgColor = {
  success: "rgb(237, 247, 237)",
  error: "rgb(253, 237, 237)",
  pending: "rgb(229, 246, 253)",
};

const txtColor = {
  success: "rgb(30, 70, 32)",
  error: "rgb(95, 33, 32)",
  pending: "rgb(1, 67, 97)",
};

const iconColor = {
  success: "rgb(46, 125, 50)",
  error: "rgb(211, 47, 47)",
  pending: "rgb(2, 136, 209)",
};

function MultiAlertComponent({ item }: { item: OperationObject }) {
  return (
    <div
      className="mt-2.5 pb-2.5 animate-fade-in flex justify-center p-1.5 rounded-lg"
      style={{
        backgroundColor:
          item.status === "pending"
            ? bgColor["pending"]
            : item.status === "success"
            ? bgColor["success"]
            : bgColor["error"],
        color:
          item.status === "pending"
            ? txtColor["pending"]
            : item.status === "success"
            ? txtColor["success"]
            : txtColor["error"],
      }}
    >
      <div
        className="mt-[6px] ml-2 mr-3.5"
        style={{
          color:
            item.status === "pending"
              ? iconColor["pending"]
              : item.status === "success"
              ? iconColor["success"]
              : iconColor["error"],
        }}
      >
        {item.status === "success" ? <Check className="h-5 w-5" /> : null}
        {item.status === "error" ? <AlertCircle className="h-5 w-5" /> : null}
        {item.status === "pending" ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : null}
      </div>
      <div className="flex flex-col">
        <div className="mt-[2.3px]">
          {item.operation === "update" ? "Update user" : null}
          {item.operation === "delete" ? "Screenshot delete" : null}
          {item.operation === "create" ? "Create user" : null}
          {item.operation === "fetch" ? "Fetching data" : null}
        </div>
        <div className="w-[250px] mt-2 mb-1">{item.message}</div>
      </div>
    </div>
  );
}

export default MultiAlertComponent;
