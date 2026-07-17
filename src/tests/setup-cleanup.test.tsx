import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('渲染一个仅供当前测试使用的标记', () => {
  render(<div data-testid="cleanup-marker" />);

  expect(screen.getByTestId('cleanup-marker')).toBeInTheDocument();
});

test('开始新测试时已清理上一个测试的 DOM', () => {
  expect(screen.queryByTestId('cleanup-marker')).not.toBeInTheDocument();
});
