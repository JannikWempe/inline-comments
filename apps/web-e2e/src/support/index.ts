import { graphql, setupWorker } from "msw";
import "./commands";

declare global {
  interface Window {
    msw: {
      worker: ReturnType<typeof setupWorker>;
      graphql: typeof graphql;
    };
  }
}
