import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '../Layout';

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

// Mocking the Content and Menu components
vi.mock('../Content', () => ({
  Content: () => <>Mocked Content</>,
}));

const renderComponent = () => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
};

describe('Layout Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Layout component with mocked Content and Menu', () => {
    renderComponent();

    // Check if mocked components are rendered
    expect(screen.getByText('Mocked Content')).toBeInTheDocument();
    expect(screen.getByText('Image manager')).toBeInTheDocument();
  });

  it('toggles the visibility of the menu when the menu icon is clicked', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    renderComponent();

    // Dispatch a resize event to ensure the component reacts to the window size change
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    const menuIcon = screen.getByTestId('menu-icon');

    expect(menuIcon).toBeInTheDocument(); // Ensure the icon exists

    expect(screen.queryByText('Image manager')).not.toBeInTheDocument();

    // Click the MenuIcon to toggle the menu visibility
    fireEvent.click(menuIcon);

    // Ensure the menu visibility has changed (check for the text "Image manager" disappearing)
    expect(screen.getByText('Image manager')).toBeInTheDocument();
  });

  it('handles window resizing to toggle isFixedMenu and isVisibleMenu', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 900 });

    renderComponent();

    expect(screen.getByText('Image manager')).toBeInTheDocument();

    // Mock the window.innerWidth getter
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);

    // Dispatch the resize event
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // Check if the menu is hidden on smaller screens
    await waitFor(() => {
      expect(screen.queryByText('Image manager')).not.toBeInTheDocument();
    });

    // Resize back to a large screen
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // Check if the menu is visible again
    expect(screen.getByText('Image manager')).toBeInTheDocument();
  });
});
