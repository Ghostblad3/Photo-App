import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Cards } from '../Cards';

vi.mock('../stores/selectedTableInfoStore', () => ({
  useSelectedTableInfoStore: vi.fn((selector) => {
    const store = {
      props: {
        columnNames: ['Name', 'Age', 'Email'],
        userNumber: '100',
        screenshotNumber: '50',
        screenshotAverageSize: '2048',
      },
      actions: {
        setTableName: vi.fn(),
        setColumnNames: vi.fn(),
        setUserNumber: vi.fn(),
        setScreenshotNumber: vi.fn(),
        setScreenshotAverageSize: vi.fn(),
        resetSelectedTableInfoStore: vi.fn(),
      },
    };
    return selector ? selector(store) : store;
  }),
}));

describe('Cards component', () => {
  it('renders card information correctly', () => {
    render(<Cards />);

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
    render(<Cards />);
    const toggleSwitch = screen.getByRole('switch');

    expect(toggleSwitch).toBeInTheDocument();

    expect(screen.getByText('User properties')).toBeInTheDocument();

    fireEvent.click(toggleSwitch);

    expect(screen.queryByText('User properties')).not.toBeInTheDocument();

    fireEvent.click(toggleSwitch);

    expect(screen.getByText('User properties')).toBeInTheDocument();
  });
});
