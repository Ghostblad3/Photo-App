import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { DeleteUserDialog } from '../DeleteUserDialog';
import { useDeleteUserStore } from '../stores/deleteUserStore.ts';
import { useUserDataStore } from '../stores/userDataStore';
import { expect, it, vi } from 'vitest';
import * as React from 'react';

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

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    // Render the dialog if open is true
    open ? <div>{children}</div> : null,
  DialogContent: ({
    children,
    onPointerDownOutside,
  }: {
    children: React.ReactNode;
    onPointerDownOutside: () => void;
  }) => <div onClick={onPointerDownOutside}>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const renderComponent = () => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <DeleteUserDialog />
    </QueryClientProvider>
  );
};

// Don't mock the `useRemoveUser` hook, let it do real requests
describe('DeleteUserDialog', () => {
  beforeEach(() => {
    // Reset the Zustand stores before each test

    useDeleteUserStore.getState().actions.resetDeleteUserStore();
    useUserDataStore
      .getState()
      .actions.setUserData([{ id: '123', name: 'John Doe' }]); // Initial user data setup
  });

  it('renders dialog when showDialog is true', async () => {
    // Set the Zustand store state directly using real actions
    useDeleteUserStore.getState().actions.setProps('123', 'id', 'users');
    useDeleteUserStore.getState().actions.setShowDialog(true);

    renderComponent();

    expect(screen.getByText('Delete user')).toBeInTheDocument();

    expect(
      screen.getByText('Are you sure you want to delete this user?')
    ).toBeInTheDocument();
  });

  it('should call mutate when the delete button is clicked and checkbox is checked', async () => {
    // Set the Zustand store state directly using real actions
    useDeleteUserStore.getState().actions.setProps('123', 'id', 'users');
    useDeleteUserStore.getState().actions.setShowDialog(true);

    renderComponent();

    const checkboxButton = screen.getByTestId('terms');
    expect(checkboxButton).toBeInTheDocument();

    await userEvent.click(checkboxButton);

    const button = await screen.findByText(/submit/i);
    expect(button).toBeEnabled();
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Delete user')).not.toBeInTheDocument();
    });

    expect(useUserDataStore.getState().props.userData).toEqual([]);
  });

  it('check if button becomes enabled or disabled depending if the checkbox is checked or not', async () => {
    // Set the Zustand store state directly using real actions
    useDeleteUserStore.getState().actions.setProps('123', 'id', 'users');
    useDeleteUserStore.getState().actions.setShowDialog(true);

    renderComponent();

    const checkboxButton = screen.getByTestId('terms');
    expect(checkboxButton).toBeInTheDocument();

    await userEvent.click(checkboxButton);

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeEnabled();

    await userEvent.click(checkboxButton);
    expect(button).toBeDisabled();
  });

  it('should not call mutate when the checkbox is not checked because button is disabled', async () => {
    // Set the Zustand store state directly using real actions
    useDeleteUserStore.getState().actions.setProps('123', 'id', 'users');
    useDeleteUserStore.getState().actions.setShowDialog(true);

    renderComponent();

    const button = screen.getByRole('button', { name: /submit/i });

    expect(button).toBeDisabled();
  });

  it('resets store on unmount', async () => {
    const resetDeleteUserStore = vi.fn();
    // Set real actions
    const actions = useDeleteUserStore.getState().actions;
    actions.resetDeleteUserStore = resetDeleteUserStore;

    // Setting the store state directly using the real actions
    actions.setShowDialog(true);

    const { unmount } = renderComponent();

    // Unmount the component
    unmount();

    // Ensure resetAddNewScreenshotStore was called on unmount
    expect(resetDeleteUserStore).toHaveBeenCalled();
  });
});
