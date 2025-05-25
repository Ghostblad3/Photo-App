import { render, screen } from '@testing-library/react';
import { SearchFieldCombobox } from '../SearchFieldCombobox'; // Import your component
import { useSearchStore } from '../stores/searchStore';
import { useUserDataStore } from '../stores/userDataStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

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
      <SearchFieldCombobox />
    </QueryClientProvider>
  );
};

describe('SeachFieldCombobox', () => {
  beforeEach(() => {
    useUserDataStore.getState().actions.setUserData([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);

    useSearchStore.getState().actions.setSearchField('');
  });

  it('should update search field when selecting a column name', async () => {
    // Re-render the component
    renderComponent();
    // Verify that the popover button shows the placeholder initially
    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent('Select by column name...');

    // Open the popover (simulating click)
    await userEvent.click(button);

    // Check if "name" and "age" options are rendered
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();

    // // Act: Select the "name" column from the dropdown
    const nameItem = screen.getByText('name');
    await userEvent.click(nameItem);

    expect(button).toHaveTextContent('name');

    expect(button).toHaveTextContent('name');
    expect(screen.queryByText('age')).not.toBeInTheDocument();

    await userEvent.click(button);

    // Check if "name" and "age" options are rendered
    expect(screen.getAllByText('name').length).toBe(2);
    expect(screen.getByText('age')).toBeInTheDocument();

    const ageItem = screen.getByText('age');
    await userEvent.click(ageItem);

    expect(button).toHaveTextContent('age');
    expect(screen.queryByText('name')).not.toBeInTheDocument();
  });

  it('should filter columns based on search input', async () => {
    // Re-render the component
    renderComponent();
    // Open the popover (simulating click)
    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox);

    // Type 'na' into the search input to filter
    const searchInput = screen.getByPlaceholderText('Search by column name...');
    await userEvent.type(searchInput, 'na');

    const filteredItems = screen.getAllByRole('option');
    expect(filteredItems.length).toBe(1); // Only "name" should remain
    expect(filteredItems[0]).toHaveTextContent('name');
  });

  it('should clear search field when selecting the same value', async () => {
    useSearchStore.getState().actions.setSearchField('name');

    // Re-render the component
    renderComponent();

    const combobox = screen.getByRole('combobox');
    // Open the popover (simulating click)
    await userEvent.click(combobox);

    // Select the already-selected "name" column to clear it
    const nameItem = screen.getByRole('option', { name: /name/i });
    await userEvent.click(nameItem);

    // The search field should be cleared
    expect(combobox).toHaveTextContent('Select by column name...');
  });
});
