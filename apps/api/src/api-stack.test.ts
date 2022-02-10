import * as cdk from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { ApiStack } from "./api-stack";

const getTestAssets = (props?: cdk.StackProps) => {
  const app = new cdk.App();
  const stack = new ApiStack(app, "ApiStack", props);
  const assert = Template.fromStack(stack);
  return { assert, stack, app };
};

it("should create 3 ddb tables", () => {
  const { assert } = getTestAssets();
  assert.resourceCountIs("AWS::DynamoDB::Table", 3);
});

it("should add table env vars to resolver lambda", () => {
  const { assert } = getTestAssets();
  const envCapture = new Capture();
  assert.resourceCountIs("AWS::Lambda::Function", 1);
  assert.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });
  expect(envCapture.asObject().Variables).toMatchObject({
    POSTS_TABLE_NAME: {
      Ref: "AppDatabasePostsTable4D946FC3",
    },
    USERS_TABLE_NAME: {
      Ref: "AppDatabaseUsersTable159D1BCC",
    },
    COMMENTS_TABLE_NAME: {
      Ref: "AppDatabaseCommentsTableA5954ACE",
    },
  });
});
