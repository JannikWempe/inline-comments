import { API as AmplifyAPI, graphqlOperation } from "aws-amplify";
import { GRAPHQL_AUTH_MODE, GraphQLResult } from "@aws-amplify/api/lib/types";

export const amplifyFetcher = <TData, TVariables>(query: string, variables?: TVariables) => {
  return async (): Promise<TData> => {
    const response = (await AmplifyAPI.graphql({
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
      ...graphqlOperation(query, variables),
    })) as GraphQLResult<any>;
    return response.data;
  };
};
