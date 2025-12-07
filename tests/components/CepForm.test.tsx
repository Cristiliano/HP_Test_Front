import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CepForm } from '../../src/components/CepForm';

describe('CepForm', () => {
  it('should render CEP input and search button', () => {
    const mockOnSubmit = vi.fn();
    render(<CepForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('should call onSubmit with CEP value when form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CepForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '01310100');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith('01310100');
  });

  it('should show validation error for invalid CEP', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CepForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '123');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/CEP deve conter 8 dígitos/i)).toBeInTheDocument();
  });

  it('should disable button when loading', () => {
    const mockOnSubmit = vi.fn();
    render(<CepForm onSubmit={mockOnSubmit} isLoading={true} />);

    const button = screen.getByRole('button', { name: /buscar/i });
    expect(button).toBeDisabled();
  });

  it('should show default value when provided', () => {
    const mockOnSubmit = vi.fn();
    render(<CepForm onSubmit={mockOnSubmit} defaultValue="01310-100" />);

    const input = screen.getByPlaceholderText('00000-000');
    expect(input).toHaveValue('01310-100');
  });
});
