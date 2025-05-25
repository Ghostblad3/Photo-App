import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchValueCombobox } from '../SearchValueCombobox'; // Import the component
import { useSearchStore } from '../stores/searchStore';
import { useUserDataStore } from '../stores/userDataStore';
import userEvent from '@testing-library/user-event';

// Create a test query client for react-query
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

// Helper to render the component with the query client provider
const renderComponent = () => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <SearchValueCombobox />
    </QueryClientProvider>
  );
};

describe('SearchValueCombobox', () => {
  it('should render with initial state and open the dropdown when clicked', async () => {
    // Mock the Zustand stores
    useSearchStore.getState().actions.setSearchField('name');
    useUserDataStore.getState().actions.setUserData([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);

    // Render the component
    renderComponent();

    // Check that the combobox button is rendered and contains the correct initial text
    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Select name...');

    // Open the dropdown by clicking the combobox button
    await userEvent.click(button);

    // Find the names
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    // Use getByRole to find the options in the dropdown and check their count
    const dropdownOptions = screen.getAllByRole('option');
    expect(dropdownOptions.length).toBeGreaterThan(0);
  });

  it('should filter and select a value from the dropdown', async () => {
    // Mock Zustand stores
    useSearchStore.getState().actions.setSearchField('name');
    useSearchStore.getState().actions.setSearchValue('');
    useUserDataStore.getState().actions.setUserData([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);

    // Render the component
    renderComponent();

    const combobox = screen.getByRole('combobox');
    // Open the dropdown
    await userEvent.click(combobox);

    // Find the names
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    // Select an option by querying the role of the option and its text content
    const johnOption = screen.getByRole('option', { name: 'John' });
    await userEvent.click(johnOption);

    // Check that the combobox shows the selected value
    expect(combobox).toHaveTextContent('John');

    // Ensure the searchValue state was updated
    expect(useSearchStore.getState().props.searchValue).toBe('John');
  });

  it('should reset search value when the same value is selected again', async () => {
    // Mock Zustand stores
    useSearchStore.getState().actions.setSearchField('name');
    useSearchStore.getState().actions.setSearchValue('John');
    useUserDataStore.getState().actions.setUserData([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);

    // Render the component
    renderComponent();

    // Check that the combobox has the selected value 'John'
    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('John');

    // Open the dropdown and select the same value again (which should reset it)
    await userEvent.click(button);
    const johnOption = screen.getByRole('option', { name: 'John' });
    await userEvent.click(johnOption);

    // Ensure the combobox text is reset to 'Select name...'
    expect(button).toHaveTextContent('Select name...');

    // Ensure that the searchValue in the store is also reset
    expect(useSearchStore.getState().props.searchValue).toBe('');
  });

  it('should show "No results found" when the user types an incorrect value', async () => {
    // Mock Zustand stores
    useSearchStore.getState().actions.setSearchField('name');
    useSearchStore.getState().actions.setSearchValue('');
    useUserDataStore.getState().actions.setUserData([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);

    // Render the component
    renderComponent();

    const combobox = screen.getByText('Select name...');
    // Open the dropdown by clicking the button with the correct text content
    await userEvent.click(combobox);

    // Find the names
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    // Find the input element
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const input = within(dialog).getByRole('combobox');
    expect(input).toBeInTheDocument();

    // Type an invalid value
    await userEvent.type(input, 'NonExistingName');

    const element = screen.getByText('No name found.');
    // Wait for the "No results found" message to appear
    expect(element).toBeInTheDocument();
  });
});
