import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Cards } from '../Cards';
import { useSelectedTableInfoStore } from '../stores/selectedTableInfoStore';
import userEvent from '@testing-library/user-event';

// Utility function to render the component
const renderComponent = () => {
  return render(<Cards />);
};

describe('Cards component', () => {
  beforeEach(() => {
    // Reset the store before each test
    useSelectedTableInfoStore.getState().actions.resetSelectedTableInfoStore();

    // Set initial store state
    useSelectedTableInfoStore
      .getState()
      .actions.setColumnNames(['Name', 'Age', 'Email']);
    useSelectedTableInfoStore.getState().actions.setUserNumber('100');
    useSelectedTableInfoStore.getState().actions.setScreenshotNumber('50');
    useSelectedTableInfoStore
      .getState()
      .actions.setScreenshotAverageSize('2048');
  });

  it('renders card information correctly', async () => {
    renderComponent();

    const toggleSwitch = screen.getByRole('switch');
    expect(toggleSwitch).toBeInTheDocument();

    await userEvent.click(toggleSwitch);

    expect(screen.getByText('User properties')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('User number')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Screenshot number')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Average screenshot size')).toBeInTheDocument();
    expect(screen.getByText('2.05 KB')).toBeInTheDocument();
  });

  it('toggles visibility when switch is clicked', async () => {
    renderComponent();
    const toggleSwitch = screen.getByRole('switch');
    expect(toggleSwitch).toBeInTheDocument();

    await userEvent.click(toggleSwitch);

    // Initial state - visible
    expect(screen.getByText('User properties')).toBeInTheDocument();

    // First click - hide
    await userEvent.click(toggleSwitch);
    expect(screen.queryByText('User properties')).not.toBeInTheDocument();

    // Second click - show again
    await userEvent.click(toggleSwitch);
    expect(screen.getByText('User properties')).toBeInTheDocument();
  });
});
