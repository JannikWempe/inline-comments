// eslint-disable-next-line import/no-extraneous-dependencies
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export let docClient = new DocumentClient();

if (!docClient) {
  docClient = new DocumentClient();
}
