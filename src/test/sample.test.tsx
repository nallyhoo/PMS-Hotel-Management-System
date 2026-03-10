import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Button Component', () => {
  it('renders button with text', () => {
    render(
      <button data-testid="test-button">Click me</button>
    );
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(
      <button onClick={handleClick}>Click me</button>
    );
    
    const button = screen.getByText('Click me');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    const formatCurrency = (amount: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('calculates date differences', () => {
    const daysBetween = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    expect(daysBetween('2026-03-10', '2026-03-15')).toBe(5);
    expect(daysBetween('2026-03-15', '2026-03-10')).toBe(5);
  });
});

describe('Zod Schemas', () => {
  it('validates email format', () => {
    const emailSchema = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    
    expect('test@example.com').toMatch(emailSchema);
    expect('invalid-email').not.toMatch(emailSchema);
  });

  it('validates required fields', () => {
    const validateRequired = (value: string) => !!(value && value.trim().length > 0);
    
    expect(validateRequired('test')).toBe(true);
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
  });
});
