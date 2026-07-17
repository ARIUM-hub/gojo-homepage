import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';

import { AppRoutes } from '../AppRoutes';

test('首页显示五条悟标题', () => {
  render(
    <MemoryRouter
      initialEntries={['/']}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '五条悟' })).toBeInTheDocument();
});
