import type { CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse } from "aws-lambda";
import { gql, GraphQLClient } from "graphql-request";

export const handler = async (
  event: CloudFormationCustomResourceEvent
): Promise<CloudFormationCustomResourceResponse> => {
  console.log("event:", JSON.stringify(event, null, 2));
  const { graphqlUrl, apiKey } = event.ResourceProperties;

  if (event.RequestType === "Delete") {
    return {
      Status: "SUCCESS",
      RequestId: event.RequestId,
      PhysicalResourceId: "Something",
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
    };
  }

  try {
    const response = await runTests(graphqlUrl, apiKey);
    console.log("response:", JSON.stringify(response, null, 2));
    console.log("Tests passed!");
    return {
      Status: "SUCCESS",
      RequestId: event.RequestId,
      PhysicalResourceId: "Something",
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
    };
  } catch (err) {
    console.error("Tests failed!", err);
    return {
      Status: "FAILED",
      Reason: JSON.stringify(err),
      RequestId: event.RequestId,
      PhysicalResourceId: "Something",
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
    };
  }
};

const runTests = (url: string, apiKey: string) => {
  const client = new GraphQLClient(url, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  // TODO: create test data, query and change it and remove it after test
  const query = gql`
    {
      getUserById(userId: "24XoFTnzIcPSibhQjWvsziTw2Hh") {
        id
        username
      }
    }
  `;

  return client.request(query);
};
