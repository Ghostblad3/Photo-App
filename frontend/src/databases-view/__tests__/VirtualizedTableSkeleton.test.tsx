import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VirtualizedTableSkeleton } from '../VirtualizedTableSkeleton';

// Mock Skeleton to simplify structure testing
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

describe('VirtualizedTableSkeleton', () => {
  it('renders exactly three Skeleton components', () => {
    render(<VirtualizedTableSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(3);
  });

  it('renders two skeletons in the header section', () => {
    render(<VirtualizedTableSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');

    // First two are part of the top input skeletons
    expect(skeletons[0]).toBeInTheDocument();
    expect(skeletons[1]).toBeInTheDocument();
  });

  it('renders one skeleton for the table body', () => {
    render(<VirtualizedTableSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');

    // Last one is the table body skeleton
    expect(skeletons[2]).toBeInTheDocument();
  });
});
