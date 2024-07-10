import UpdateUserDialog from "./UpdateUserDialog";
import AddNewScreenshotDialog from "./AddNewScreenshotDialog";
import AddNewUserDialog from "./AddNewUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import DeleteUserScreenshotDialog from "./DeleteUserScreenshotDialog";
import ScreenshotDialog from "./ScreenshotDialog";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";
import addNewUserStore from "./stores/addNewUserStore";
import deleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";
import deleteUserStore from "./stores/deleteUserStore";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import updateUserInfoStore from "./stores/updateUserInfoStore";

function Dialogs() {
  const screenshowAsBase64ShowDialog = screenshotAsBase64Store(
    (state) => state.props.showDialog
  );

  const addNewScreenshotShowDialog = addNewScreenshotStore(
    (state) => state.props.showDialog
  );
  const addNewUserShowDialog = addNewUserStore(
    (state) => state.props.showDialog
  );
  const deleteUserScreenshotShowDialog = deleteUserScreenshotStore(
    (state) => state.props.showDialog
  );

  const updateUserInfoShowDialog = updateUserInfoStore(
    (state) => state.props.showDialog
  );
  const deleteUserShowDialog = deleteUserStore(
    (state) => state.props.showDialog
  );

  return (
    <>
      {addNewScreenshotShowDialog && <AddNewScreenshotDialog />}
      {updateUserInfoShowDialog && <UpdateUserDialog />}
      {deleteUserScreenshotShowDialog && <DeleteUserScreenshotDialog />}
      {deleteUserShowDialog && <DeleteUserDialog />}
      {addNewUserShowDialog && <AddNewUserDialog />}
      {screenshowAsBase64ShowDialog && <ScreenshotDialog />}
    </>
  );
}

export default Dialogs;
