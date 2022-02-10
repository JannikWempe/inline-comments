/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { queries, Queries, render, RenderOptions } from "@testing-library/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

export * from "@testing-library/react";

export const createRenderWithClient =
  (client: QueryClient) =>
  <Q extends Queries = typeof queries, Container extends Element | DocumentFragment = HTMLElement>(
    ui,
    options?: RenderOptions<Q, Container>
  ) => {
    const { rerender, ...result } = render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>, options);
    return {
      ...result,
      rerender: (rerenderUi: React.ReactElement) =>
        rerender(<QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>),
    };
  };

export const renderWithClient = createRenderWithClient(queryClient);

// override React Testing Library's render with our own
export { renderWithClient as render };
