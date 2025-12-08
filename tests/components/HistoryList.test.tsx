import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryList } from '../../src/components/HistoryList';
import type { CepHistoryItem } from '../../src/types';

describe('HistoryList', () => {
  const mockHistory: CepHistoryItem[] = [
    { cep: '01310100', cidade: 'São Paulo', uf: 'SP', timestamp: Date.now() - 60000 },
    { cep: '22041080', cidade: 'Rio de Janeiro', uf: 'RJ', timestamp: Date.now() - 3600000 },
  ];

  const defaultProps = {
    history: mockHistory,
    onSelect: vi.fn(),
    onClear: vi.fn(),
    onRemove: vi.fn(),
  };

  it('should render empty state when history is empty', () => {
    render(<HistoryList {...defaultProps} history={[]} />);

    expect(screen.getByText('Nenhuma consulta recente')).toBeInTheDocument();
    expect(screen.getByText('Suas últimas buscas aparecerão aqui')).toBeInTheDocument();
  });

  it('should render history items', () => {
    render(<HistoryList {...defaultProps} />);

    expect(screen.getByText('01310-100')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
    expect(screen.getByText('22041-080')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro, RJ')).toBeInTheDocument();
  });

  it('should show history count badge', () => {
    render(<HistoryList {...defaultProps} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onSelect when item is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<HistoryList {...defaultProps} onSelect={onSelect} />);

    const item = screen.getByText('01310-100').closest('div[class*="cursor-pointer"]');
    await user.click(item!);

    expect(onSelect).toHaveBeenCalledWith('01310100');
  });

  it('should call onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(<HistoryList {...defaultProps} onClear={onClear} />);

    const clearButton = screen.getByRole('button', { name: /limpar/i });
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should call onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(<HistoryList {...defaultProps} onRemove={onRemove} />);

    const removeButtons = screen.getAllByTitle('Remover do histórico');
    await user.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith('01310100');
  });

  it('should display relative time for each item', () => {
    render(<HistoryList {...defaultProps} />);

    expect(screen.getByText('há 1 minuto')).toBeInTheDocument();
    expect(screen.getByText('há 1 hora')).toBeInTheDocument();
  });

  it('should render header with title', () => {
    render(<HistoryList {...defaultProps} />);

    expect(screen.getByText('Consultas Recentes')).toBeInTheDocument();
  });
});
