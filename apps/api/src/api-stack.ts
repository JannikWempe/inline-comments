import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppApi } from "./lib/api";
import { AppDatabase } from "./lib/database";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new AppDatabase(this, "AppDatabase");
    new AppApi(this, "AppApi", {
      postsTable: database.postsTable,
      usersTable: database.usersTable,
      commentsTable: database.commentsTable,
    });
  }
}
