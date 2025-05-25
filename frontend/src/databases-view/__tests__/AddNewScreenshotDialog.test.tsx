import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AddNewScreenshotDialog } from '../AddNewScreenshotDialog';
import { useAddNewScreenshotStore } from '../stores/addNewScreenshotStore';

// Mocking the components
vi.mock('../DragAndDropPng', () => ({
  DragAndDropPng: () => <div>DragAndDropPng</div>,
}));
vi.mock('../ImageCrop', () => ({
  ImageCrop: () => <div>ImageCrop</div>,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    // Render children but control visibility via a prop, not style
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
  return render(<AddNewScreenshotDialog />);
};

describe('AddNewScreenshotDialog', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAddNewScreenshotStore.getState().actions.resetAddNewScreenshotStore();
  });

  it('renders DragAndDropPng when screenshotAsBase64 is empty', async () => {
    // Setting the store state directly using the real actions
    useAddNewScreenshotStore.getState().actions.setShowDialog(true);
    useAddNewScreenshotStore.getState().actions.setScreenshotAsBase64('');

    renderComponent();

    // Ensure that DragAndDropPng is rendered and ImageCrop is not
    expect(screen.getByText('DragAndDropPng')).toBeInTheDocument();
    expect(screen.queryByText('ImageCrop')).not.toBeInTheDocument();
  });

  it('renders ImageCrop when screenshotAsBase64 is non-empty', async () => {
    // Setting the store state directly using the real actions
    useAddNewScreenshotStore.getState().actions.setShowDialog(true);
    useAddNewScreenshotStore
      .getState()
      .actions.setScreenshotAsBase64('base64data');

    renderComponent();

    // Ensure that ImageCrop is rendered and DragAndDropPng is not
    expect(screen.getByText('ImageCrop')).toBeInTheDocument();
    expect(screen.queryByText('DragAndDropPng')).not.toBeInTheDocument();
  });

  it('resets store on unmount', async () => {
    const resetAddNewScreenshotStore = vi.fn();
    // Set real actions
    const actions = useAddNewScreenshotStore.getState().actions;
    actions.resetAddNewScreenshotStore = resetAddNewScreenshotStore;

    // Setting the store state directly using the real actions
    actions.setShowDialog(true);
    actions.setScreenshotAsBase64('');

    const { unmount } = renderComponent();

    // Unmount the component
    unmount();

    // Ensure resetAddNewScreenshotStore was called on unmount
    expect(resetAddNewScreenshotStore).toHaveBeenCalled();
  });
});
