import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddNewUserDialog } from '../AddNewUserDialog';
import { useAddNewUserStore } from '../stores/addNewUserStore';
import { useUserDataStore } from '../stores/userDataStore';

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

vi.mock('@/utils/delay', () => ({
  delay: vi.fn().mockResolvedValue(undefined), // instantly resolves
}));

// Mock the dialog components
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
      <AddNewUserDialog />
    </QueryClientProvider>
  );
};

describe('AddNewUserDialog', () => {
  beforeEach(() => {
    // Set initial state before each test
    useAddNewUserStore.getState().actions.setShowDialog(true);
    useAddNewUserStore.getState().actions.setTableName('test_table');

    useUserDataStore
      .getState()
      .actions.setUserKeys(['username', 'email', 'age']);
    useUserDataStore.getState().actions.setUserData([]);
  });

  it('opens the dialog when showDialog is true', () => {
    renderComponent();

    // Ensure the dialog is rendered
    expect(screen.getByText('Add new user')).toBeInTheDocument();
  });

  it('enables the submit button when all fields are filled', async () => {
    renderComponent();

    // Find the input fields using text content (e.g., "username", "email", "age")
    const usernameLabel = screen.getByText(/username/i);
    const emailLabel = screen.getByText(/email/i);
    const ageLabel = screen.getByText(/age/i);

    // Find input elements related to the labels
    const usernameInput = usernameLabel?.closest('div')?.querySelector('input');
    const emailInput = emailLabel?.closest('div')?.querySelector('input');
    const ageInput = ageLabel?.closest('div')?.querySelector('input');
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();

    // Enter some values into the inputs
    await userEvent.type(usernameInput!, 'JohnDoe');
    await userEvent.type(emailInput!, 'johndoe@example.com');
    await userEvent.type(ageInput!, '30');

    // Ensure that the submit button is enabled
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('enables the submit button when all fields are filled', async () => {
    renderComponent();

    // Find the input fields using text content (e.g., "username", "email", "age")
    const usernameLabel = screen.getByText(/username/i);
    const emailLabel = screen.getByText(/email/i);
    const ageLabel = screen.getByText(/age/i);

    // Find input elements related to the labels
    const usernameInput = usernameLabel?.closest('div')?.querySelector('input');
    const emailInput = emailLabel?.closest('div')?.querySelector('input');
    const ageInput = ageLabel?.closest('div')?.querySelector('input');
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();

    // Enter some values into the inputs
    await userEvent.type(usernameInput!, 'JohnDoe');
    await userEvent.type(emailInput!, 'johndoe@example.com');
    await userEvent.type(ageInput!, '30');

    // Ensure that the submit button is enabled
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();

    await userEvent.clear(usernameInput!);
    expect(submitButton).toBeDisabled();
  });

  it('disables the submit button when some fields are empty', async () => {
    renderComponent();

    // Find the input fields using text content (e.g., "username", "email", "age")
    const usernameLabel = screen.getByText(/username/i);
    const emailLabel = screen.getByText(/email/i);

    // Find input elements related to the labels
    const usernameInput = usernameLabel?.closest('div')?.querySelector('input');
    const emailInput = emailLabel?.closest('div')?.querySelector('input');

    // Enter some values but leave the "age" field empty

    await userEvent.type(usernameInput!, 'JohnDoe');
    await userEvent.type(emailInput!, 'johndoe@example.com');

    // Ensure that the submit button is disabled (since the "age" field is empty)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls addUser when the submit button is clicked and the form is valid', async () => {
    renderComponent();

    // Find the input fields using text content
    const usernameLabel = screen.getByText(/username/i);
    const emailLabel = screen.getByText(/email/i);
    const ageLabel = screen.getByText(/age/i);

    // Find input elements related to the labels
    const usernameInput = usernameLabel?.closest('div')?.querySelector('input');
    const emailInput = emailLabel?.closest('div')?.querySelector('input');
    const ageInput = ageLabel?.closest('div')?.querySelector('input');

    // Enter some values into the inputs
    await userEvent.type(usernameInput!, 'JohnDoe');
    await userEvent.type(emailInput!, 'johndoe@example.com');
    await userEvent.type(ageInput!, '30');

    // Click the submit button
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Ensure the addUser function was called

    const users = useUserDataStore.getState().props.userData;
    expect(users.length).toBe(1);
  });

  it('shows validation error when a field exceeds the maximum character length', async () => {
    renderComponent();

    // Find the input field for the username
    const usernameLabel = screen.getByText(/username/i);
    const usernameInput = usernameLabel?.closest('div')?.querySelector('input');

    // Type a value longer than 50 characters
    const longUsername = 'a'.repeat(51);
    await userEvent.type(usernameInput!, longUsername);

    // Ensure the error message is displayed
    const errorMessage = screen.getByText(
      /field must be between 1 and 50 characters/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('closes the dialog after successful submission', async () => {
    renderComponent();

    const usernameInput = screen
      .getByText(/username/i)
      ?.closest('div')
      ?.querySelector('input');
    const emailInput = screen
      .getByText(/email/i)
      ?.closest('div')
      ?.querySelector('input');
    const ageInput = screen
      .getByText(/age/i)
      ?.closest('div')
      ?.querySelector('input');

    await userEvent.type(usernameInput!, 'JohnDoe');
    await userEvent.type(emailInput!, 'johndoe@example.com');
    await userEvent.type(ageInput!, '30');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    expect(useAddNewUserStore.getState().props.showDialog).toBe(false);
  });
});
