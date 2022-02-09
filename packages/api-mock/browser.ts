import { graphql, setupWorker } from 'msw';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Expose methods globally to make them available in integration tests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.msw = {
  worker,
  graphql,
};
