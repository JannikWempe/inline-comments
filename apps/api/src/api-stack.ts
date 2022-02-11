import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IntegrationTestStack } from "./integration-test-stack";
import { AppApi } from "./lib/api";
import { AppDatabase } from "./lib/database";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new AppDatabase(this, "AppDatabase");
    const api = new AppApi(this, "AppApi", {
      postsTable: database.postsTable,
      usersTable: database.usersTable,
      commentsTable: database.commentsTable,
    });

    new IntegrationTestStack(this, "IntegrationTestStack", {
      graphqlUrl: api.api.graphqlUrl,
      apiKey: api.api.apiKey!,
    });
  }
}
