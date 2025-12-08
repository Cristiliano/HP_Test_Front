import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DaysSelector } from '../../src/components/DaysSelector';

describe('DaysSelector', () => {
  const defaultProps = {
    value: 3,
    onChange: vi.fn(),
    min: 1,
    max: 7,
  };

  it('should render all day options', () => {
    render(<DaysSelector {...defaultProps} />);

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(`${i} ${i === 1 ? 'dia' : 'dias'}`)).toBeInTheDocument();
    }
  });

  it('should highlight selected day', () => {
    render(<DaysSelector {...defaultProps} value={5} />);

    const selectedButton = screen.getByText('5 dias');
    expect(selectedButton).toHaveClass('bg-indigo-600');
  });

  it('should call onChange when day is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DaysSelector {...defaultProps} onChange={onChange} />);

    await user.click(screen.getByText('7 dias'));

    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('should render label', () => {
    render(<DaysSelector {...defaultProps} />);

    expect(screen.getByText('Dias de previsão')).toBeInTheDocument();
  });

  it('should use default min and max when not provided', () => {
    render(<DaysSelector value={3} onChange={vi.fn()} />);

    expect(screen.getByText('1 dia')).toBeInTheDocument();
    expect(screen.getByText('7 dias')).toBeInTheDocument();
  });
});
