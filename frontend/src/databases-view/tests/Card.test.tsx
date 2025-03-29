import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test Content</p>
      </Card>
    );

    const childElement = screen.getByText('Test Content');
    expect(childElement).toBeInTheDocument();
  });
});
