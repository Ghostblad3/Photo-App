import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardsSkeleton } from '../CardsSkeleton';

describe('CardsSkeleton', () => {
  it('renders both header skeletons', () => {
    render(<CardsSkeleton />);

    expect(screen.getByTestId('header-skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('header-skeleton-2')).toBeInTheDocument();
  });

  it('renders all 4 card skeletons', () => {
    render(<CardsSkeleton />);

    expect(screen.getByTestId('card-skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-skeleton-3')).toBeInTheDocument();
    expect(screen.getByTestId('card-skeleton-4')).toBeInTheDocument();
  });
});
