import { RemovalPolicy } from "aws-cdk-lib";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { TableProps } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

const tableDefaults: Partial<TableProps> = {
  billingMode: ddb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY,
};

export class AppDatabase extends Construct {
  public readonly postsTable: ddb.ITable;
  public readonly usersTable: ddb.ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.postsTable = new ddb.Table(this, "PostsTable", {
      ...tableDefaults,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    this.usersTable = new ddb.Table(this, "UsersTable", {
      ...tableDefaults,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
  }
}
