/* eslint-disable no-console */
import { MockedRequest } from "msw";

const IGNORED_UNHANDLED_REQUESTS: RegExp[] = [/next/gi, /cypress/gi, /hot-update/gi, /webpack/gi, /fonts/gi];

const onUnhandledRequest = (req: MockedRequest) => {
  const isIgnored = IGNORED_UNHANDLED_REQUESTS.some((ignored) => ignored.test(req.url.href));
  if (!isIgnored) {
    console.warn("Found an unhandled %s request to %s", req.method, req.url.href);
    throw Error("Unhandled request");
  }
};

export const startMockServiceWorker = () => {
  if (!(process.env.NODE_ENV === "development")) {
    console.warn("Mock service worker is only available in development mode");
    return;
  }

  if (typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { server } = require("./server");
    console.log("MSW is listening...");
    server.listen({
      onUnhandledRequest,
      // onUnhandledRequest: "error",
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { worker } = require("./browser");
    console.log("MSW is starting...");
    worker.start({
      onUnhandledRequest,
    });
  }
};
