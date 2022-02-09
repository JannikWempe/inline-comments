import React, { useState } from "react";

import "../styles/global.css";
import type { AppProps } from "next/app";

import Amplify from "aws-amplify";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { startMockServiceWorker } from "api-mock";
import cdkExports from "../cdk-exports.json";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  startMockServiceWorker();
}

Amplify.configure({
  aws_project_region: cdkExports.ApiStack.AppApiAwsAppsyncRegionCF761689,
  aws_appsync_region: cdkExports.ApiStack.AppApiAwsAppsyncRegionCF761689,
  aws_appsync_graphqlEndpoint: cdkExports.ApiStack.AppApiAwsAppsyncGraphqlEndpointDE5D3381,
  aws_appsync_authenticationType: cdkExports.ApiStack.AppApiAwsAppsyncAuthenticationType8EA983C5,
  aws_appsync_apiKey: cdkExports.ApiStack.AppApiAwsAppsyncApiKey83F37EC8,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient} contextSharing>
      <Hydrate state={pageProps.dehydratedState}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
