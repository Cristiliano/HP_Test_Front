import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorDisplay } from '../../src/components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render error message', () => {
    render(<ErrorDisplay message="CEP não encontrado" />);

    expect(screen.getByText('CEP não encontrado')).toBeInTheDocument();
    expect(screen.getByText('Erro na consulta')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorDisplay message="Erro ao consultar" onRetry={mockRetry} />);

    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('should NOT render retry button when onRetry is not provided', () => {
    render(<ErrorDisplay message="Erro ao consultar" />);

    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const mockRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorDisplay message="Erro ao consultar" onRetry={mockRetry} />);

    const button = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(button);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should have proper alert role for accessibility', () => {
    render(<ErrorDisplay message="Erro" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
