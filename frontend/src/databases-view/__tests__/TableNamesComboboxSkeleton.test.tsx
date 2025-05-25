import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableNamesComboboxSkeleton } from '../TableNamesComboboxSkeleton';

// Mock Skeleton to isolate and simplify rendering
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

describe('TableNamesComboboxSkeleton', () => {
  it('renders four Skeleton components', () => {
    render(<TableNamesComboboxSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('renders two Skeletons in the first section', () => {
    render(<TableNamesComboboxSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons[0]).toBeInTheDocument();
    expect(skeletons[1]).toBeInTheDocument();
  });

  it('renders two Skeletons in the second section', () => {
    render(<TableNamesComboboxSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons[2]).toBeInTheDocument();
    expect(skeletons[3]).toBeInTheDocument();
  });
});
