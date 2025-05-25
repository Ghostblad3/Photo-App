import { render, screen, waitFor } from '@testing-library/react';
import { TableNamesCombobox } from '../TableNamesCombobox';
import { useSearchStore } from '../stores/searchStore';
import { useSelectedTableInfoStore } from '../stores/selectedTableInfoStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useTableNamesStore } from '@/images-view/stores/tableNamesStore.ts';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

vi.mock('@/utils/delay', () => ({
  delay: vi.fn().mockResolvedValue(undefined), // instantly resolves
}));

vi.mock('../TableNamesComboboxSkeleton', () => ({
  TableNamesComboboxSkeleton: () => <div>Skeleton</div>,
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
      <TableNamesCombobox />
    </QueryClientProvider>
  );
};

describe('TableNamesCombobox', () => {
  beforeEach(() => {
    // vi.resetModules();
    vi.clearAllMocks();
    // Reset Zustand stores before each test
    useTableNamesStore.getState().actions.resetTableNamesStore();
    useSearchStore.getState().actions.resetSearchStore();
    useSelectedTableInfoStore.getState().actions.setTableName('');
  });

  it('renders table names combobox with available tables', async () => {
    renderComponent();

    // Check if the placeholder text is rendered initially
    await waitFor(() => {
      expect(screen.getByText('Select table')).toBeInTheDocument();
    });

    // Open the dropdown
    const button = screen.getByRole('combobox');
    expect(button).toBeInTheDocument();

    const text = screen.getByText('Select table...');
    expect(text).toBeInTheDocument();

    await userEvent.click(button);

    const tableName = screen.getByText('test_name');
    expect(tableName).toBeInTheDocument();
  });

  it('sets the selected table name when a table is selected', async () => {
    renderComponent();

    const resetSearchStoreMock = vi.fn();
    useSearchStore.getState().actions.resetSearchStore = resetSearchStoreMock;

    // Check if the placeholder text is rendered initially
    await waitFor(() => {
      expect(screen.getByText('Select table')).toBeInTheDocument();
    });

    // Open the dropdown
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();

    await userEvent.click(combobox);

    const tableNameOption = screen.getByRole('option', { name: 'test_name' });
    await userEvent.click(tableNameOption);

    // Check that the combobox shows the selected value
    expect(combobox).toHaveTextContent('test_name');

    // Check that the selected table name was set in Zustand store
    expect(useSelectedTableInfoStore.getState().props.tableName).toBe(
      'test_name'
    );
    expect(resetSearchStoreMock).toHaveBeenCalled();
  });

  it('disables combobox button when no table names are available', async () => {
    server.use(
      http.get<never, undefined, {}, 'http://localhost:3000/table/names'>(
        'http://localhost:3000/table/names',
        async () => {
          return HttpResponse.json({
            status: 'success',
            data: [],
            error: { message: '' },
          });
        }
      )
    );

    renderComponent();

    expect(screen.getByText('Skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Select table')).toBeInTheDocument();
    });

    const button = screen.getByRole('combobox');

    expect(button).toBeDisabled();
  });

  it('handles error state', async () => {
    server.use(
      http.get<never, undefined, {}, 'http://localhost:3000/table/names'>(
        'http://localhost:3000/table/names',
        async () => {
          return HttpResponse.json({
            status: 'error',
            data: [],
            error: { message: 'Some Error' },
          });
        }
      )
    );

    renderComponent();

    expect(screen.getByText('Skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Skeleton')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Select table')).not.toBeInTheDocument();
  });
});
