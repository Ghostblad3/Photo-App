import { UpdateUserDialog } from './UpdateUserDialog';
import { AddNewScreenshotDialog } from './AddNewScreenshotDialog';
import { AddNewUserDialog } from './AddNewUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { DeleteUserScreenshotDialog } from './DeleteUserScreenshotDialog';
import { ScreenshotDialog } from './ScreenshotDialog';
import { useAddNewScreenshotStore } from './stores/addNewScreenshotStore';
import { useAddNewUserStore } from './stores/addNewUserStore';
import { useDeleteUserScreenshotStore } from './stores/deleteUserScreenshotStore';
import { useDeleteUserStore } from './stores/deleteUserStore.ts';
import { useScreenshotStore } from './stores/screenshotStore';
import { useUpdateUserInfoStore } from './stores/updateUserInfoStore';

function Dialogs() {
  const screenshotShowDialog = useScreenshotStore(
    (state) => state.props.showDialog
  );
  const addNewScreenshotShowDialog = useAddNewScreenshotStore(
    (state) => state.props.showDialog
  );
  const addNewUserShowDialog = useAddNewUserStore(
    (state) => state.props.showDialog
  );
  const deleteUserScreenshotShowDialog = useDeleteUserScreenshotStore(
    (state) => state.props.showDialog
  );
  const updateUserInfoShowDialog = useUpdateUserInfoStore(
    (state) => state.props.showDialog
  );
  const deleteUserShowDialog = useDeleteUserStore(
    (state) => state.props.showDialog
  );

  return (
    <>
      {addNewScreenshotShowDialog && <AddNewScreenshotDialog />}
      {updateUserInfoShowDialog && <UpdateUserDialog />}
      {deleteUserScreenshotShowDialog && <DeleteUserScreenshotDialog />}
      {deleteUserShowDialog && <DeleteUserDialog />}
      {addNewUserShowDialog && <AddNewUserDialog />}
      {screenshotShowDialog && <ScreenshotDialog />}
    </>
  );
}

export { Dialogs };
