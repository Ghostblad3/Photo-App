import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragAndDropPng } from '../DragAndDropPng';
import { useAddNewScreenshotStore } from '../stores/addNewScreenshotStore';

// Polyfill DataTransfer if not defined
if (typeof DataTransfer === 'undefined') {
  class DataTransferMock {
    files: File[] = [];
    items = {
      add: (file: File) => {
        this.files.push(file);
      },
    };
  }
  // @ts-ignore
  global.DataTransfer = DataTransferMock;
}

describe('DragAndDropPng Component', () => {
  beforeEach(() => {
    // Reset the screenshot base64 state before each test
    useAddNewScreenshotStore.getState().actions.setScreenshotAsBase64('');
  });

  it('should handle drag-and-drop file upload', async () => {
    // Create a dummy file to simulate the drop event
    const file = new File(['dummy content'], 'image.png', {
      type: 'image/png',
    });

    // Create a DataTransfer instance and add the file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Arrange: Render the component
    const { container } = render(<DragAndDropPng />);

    // Act: Simulate the drop event by providing the dataTransfer object
    fireEvent.drop(container.querySelector('div')!, {
      dataTransfer: dataTransfer,
    });

    // Assert: Wait for the store state to update with the base64 string
    await waitFor(() => {
      const { props } = useAddNewScreenshotStore.getState();
      expect(props.screenshotAsBase64).toContain('data:image/png;base64,');
    });
  });

  it('should handle file selection through input', async () => {
    // Arrange: Render the component and get the container
    const { container } = render(<DragAndDropPng />);

    // Create a dummy file to simulate file input
    const file = new File(['dummy content'], 'image.png', {
      type: 'image/png',
    });

    // Act: Simulate file input change event using userEvent.upload
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await userEvent.upload(input, file);

    // Assert: Wait for the store state to update with the base64 string
    await waitFor(() => {
      const { props } = useAddNewScreenshotStore.getState();
      expect(props.screenshotAsBase64).toContain('data:image/png;base64,');
    });
  });

  it('should open file input dialog when button is clicked', async () => {
    // Arrange: Render the component
    const { container } = render(<DragAndDropPng />);

    // Act: Simulate a button click to open the file input dialog
    const button = screen.getByText('Select a png file from your computer');
    await userEvent.click(button);

    // Get the hidden input element
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    // Simulate a file input selection (upload a dummy file)
    const file = new File(['dummy content'], 'image.png', {
      type: 'image/png',
    });
    await userEvent.upload(input, file);

    // Assert: Check that the file input has been uploaded (by verifying the file has been "set")
    expect(input.files?.length).toBe(1);
    expect(input.files?.[0].name).toBe('image.png');
  });
});
