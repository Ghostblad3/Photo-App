import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScreenshotDialog } from '../ScreenshotDialog';
import { useScreenshotStore } from '../stores/screenshotStore';

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
  DialogContent: ({
    children,
    onInteractOutside,
  }: {
    children: React.ReactNode;
    onInteractOutside: () => void;
  }) => <div onClick={onInteractOutside}>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Skeleton and Image
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="skeleton">{children}</div>
  ),
}));
vi.mock('lucide-react', () => ({
  Image: () => <svg data-testid="image-icon" />,
}));

// Setup helpers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

const renderComponent = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ScreenshotDialog />
    </QueryClientProvider>
  );
};

describe('ScreenshotDialog', () => {
  beforeEach(() => {
    // Set store to open dialog and mock user info using getState().actions
    useScreenshotStore.getState().actions.setShowDialog(true);
    useScreenshotStore.getState().actions.setUserInfo({
      username: 'johndoe',
      email: 'john@example.com',
    });
    useScreenshotStore.getState().actions.setTableName('someTable');
    useScreenshotStore.getState().actions.setKeyName('username');
  });

  it('renders loading state with skeleton and image icon', () => {
    // When the hook is fetching
    renderComponent();

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('image-icon')).toBeInTheDocument();
  });

  it('renders image when data is available and not fetching', async () => {
    renderComponent();

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    const img = screen.getByAltText('user screenshot') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(
      'data:image/png;base64,mocked_base64_image_data=='
    );
  });

  it('renders userInfo fields correctly', () => {
    renderComponent();

    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('closes dialog on outside click by calling resetScreenshotStore', async () => {
    renderComponent();

    // Simulate clicking outside the dialog (on DialogContent)
    const dialogContent = screen.getByText('username').closest('div'); // find the mocked DialogContent container
    dialogContent?.click();

    await waitFor(() => {
      expect(screen.queryByText('User screenshot')).not.toBeInTheDocument();
    });
  });

  it('calls resetScreenshotStore on unmount', () => {
    const resetFn = vi.fn();
    useScreenshotStore.getState().actions.resetScreenshotStore = resetFn;

    const { unmount } = renderComponent();
    unmount();

    expect(resetFn).toHaveBeenCalled();
  });
});
