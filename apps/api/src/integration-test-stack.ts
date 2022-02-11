import path from "path";
import { CustomResource, NestedStack, NestedStackProps, Stack } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Lambda } from "./lib/lambda";

interface IntegrationTestStackProps extends NestedStackProps {
  graphqlUrl: string;
  apiKey: string;
}

export class IntegrationTestStack extends NestedStack {
  testResource: CustomResource;

  constructor(stack: Stack, id: string, props: IntegrationTestStackProps) {
    super(stack, id, props);
    const onEventHandler = new Lambda(stack, "IntTestLambda", {
      entry: path.join(__dirname, ".", "integration-test-lambda.ts"),
    });

    const intTestProvider = new Provider(stack, "IntTestProvider", {
      logRetention: RetentionDays.ONE_DAY,
      onEventHandler,
    });

    this.testResource = new CustomResource(stack, "IntTestResource", {
      properties: { Version: new Date().getTime().toString(), graphqlUrl: props.graphqlUrl, apiKey: props.apiKey },
      serviceToken: intTestProvider.serviceToken,
    });
  }
}
