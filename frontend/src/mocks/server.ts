import { setupServer } from 'msw/node';
import { handlers } from './handlers'; // Define request handlers

export const server = setupServer(...handlers);

// Start the server before __tests__ and reset handlers after each test
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
