import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader } from "lucide-react";
import operationStore from "./stores/operationStore";

function AlertComponent() {
  const { status, operation } = operationStore((state) => ({
    status: state.status,
    operation: state.operation,
  }));

  function getDescriptionMessage() {
    if (operation === "update") {
      switch (status) {
        case "success":
          return "Successfuly updated user information.";
        case "error":
          return "An error occured while trying to update user information.";
        case "pending":
          return "Updating user information. Please wait...";
      }
    }

    if (operation === "delete") {
      switch (status) {
        case "success":
          return "Successfuly deleted screenshot.";
        case "error":
          return "An error occured while trying to delete screenshot.";
        case "pending":
          return "Deleting screenshot. Please wait...";
      }
    }

    if (operation === "create") {
      switch (status) {
        case "success":
          return "Successfuly created user.";
        case "error":
          return "An error occured while trying to create user.";
        case "pending":
          return "Creating user. Please wait...";
      }
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <Alert className="w-80 mr-4">
          {status === "success" ? <Check className="h-4 w-4" /> : null}
          {status === "error" ? <AlertCircle className="h-4 w-4" /> : null}
          {status === "pending" ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : null}

          <AlertTitle>
            {operation === "update" ? "Update user" : null}
            {operation === "delete" ? "Screenshot delete" : null}
            {operation === "create" ? "Create user" : null}
          </AlertTitle>
          <AlertDescription>{getDescriptionMessage()}</AlertDescription>
        </Alert>
      </div>
    </>
  );
}

export default AlertComponent;
