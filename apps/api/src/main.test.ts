import { App } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { ApiStack } from "./api-stack";

test("Snapshot", () => {
  const app = new App();
  const stack = new ApiStack(app, "test");

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

it("should add AWS_NODEJS_CONNECTION_REUSE_ENABLED=1 to every lambda", () => {
  const app = new cdk.App();

  const apiStack = new ApiStack(app, "ApiStack");

  const template = Template.fromStack(apiStack);
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: Match.objectLike({
      Variables: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
    }),
  });
});
