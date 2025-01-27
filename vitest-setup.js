import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// reset jsdom (simulated browser) after each test
afterEach(() => {
    cleanup();
});