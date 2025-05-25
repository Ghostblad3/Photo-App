import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { useUpdateUserInfoStore } from '../stores/updateUserInfoStore';
import { useUserDataStore } from '../stores/userDataStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UpdateUserDialog } from '../UpdateUserDialog.tsx';
import userEvent from '@testing-library/user-event';

vi.mock('@/utils/delay', () => ({
  delay: vi.fn().mockResolvedValue(undefined), // instantly resolves
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Disable refetch on window focus
        refetchOnReconnect: false, // Disable refetch on network reconnect
        refetchInterval: false, // Disable automatic refetch interval
        retry: false, // Disables retries globally
      },
    },
  });

const renderComponent = () => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <UpdateUserDialog />
    </QueryClientProvider>
  );
};

describe('UpdateUserDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set default dialog and user data
    const updateStore = useUpdateUserInfoStore.getState();
    updateStore.actions.setShowDialog(true);
    updateStore.actions.setUserId('mock_user_id');
    updateStore.actions.setTableName('mock_table');
    updateStore.actions.setUserIndex('0');
    updateStore.actions.setUserId('0');

    const userStore = useUserDataStore.getState();
    userStore.actions.setUserData([
      {
        name: 'John',
        email: 'john@example.com',
      },
    ]);
    userStore.actions.setUserKeys(['name', 'email']);
  });

  it('renders the dialog with input fields and update button', () => {
    renderComponent();

    expect(screen.getByText(/update user information/i)).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('shows validation error when inputs are empty or too long', async () => {
    renderComponent();

    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).toBeInTheDocument();
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'a'.repeat(51));

    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeInTheDocument();
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'b'.repeat(51));

    // Simulate blur to trigger validation if needed
    nameInput.blur();
    emailInput.blur();

    expect(
      screen.getAllByText(/field must be between 1 and 50 characters/i)
    ).toHaveLength(2);
  });

  it('updates user and closes dialog on successful update', async () => {
    const resetUpdateUserInfoStoreMock = vi.fn();
    useUpdateUserInfoStore.getState().actions.resetUpdateUserInfoStore =
      resetUpdateUserInfoStoreMock;

    const updateUserMock = vi.fn();
    useUserDataStore.getState().actions.updateUser = updateUserMock;

    const { unmount } = renderComponent();

    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).toBeInTheDocument();
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'tom');

    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeInTheDocument();
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'tom@example.com');

    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    await userEvent.click(button);

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith('0', {
        name: 'tom',
        email: 'tom@example.com',
      });
      expect(useUpdateUserInfoStore.getState().props.showDialog).toBe(false);
    });

    unmount();

    expect(resetUpdateUserInfoStoreMock).toHaveBeenCalled();
  });

  it('closes dialog on update error without modifying data', async () => {
    const resetUpdateUserInfoStoreMock = vi.fn();
    useUpdateUserInfoStore.getState().actions.resetUpdateUserInfoStore =
      resetUpdateUserInfoStoreMock;

    const updateUserMock = vi.fn(); // Should NOT be called
    useUserDataStore.getState().actions.updateUser = updateUserMock;

    const { unmount } = renderComponent();

    const nameInput = screen.getByTestId('name-input');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'fail'); // simulate value that'll trigger a failure on backend

    const emailInput = screen.getByTestId('email-input');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'fail@example.com');

    const button = screen.getByRole('button', { name: /update/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(useUpdateUserInfoStore.getState().props.showDialog).toBe(false);
    });

    expect(updateUserMock).not.toHaveBeenCalled(); // confirm userData store was not updated

    unmount();

    expect(resetUpdateUserInfoStoreMock).toHaveBeenCalled();
  });
});
