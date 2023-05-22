/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Home } from './pages';

test('renders home page link', () => {
  render(<Home />);
  expect(screen.queryAllByText("ToL Portal")).not.toHaveLength(0);
});
