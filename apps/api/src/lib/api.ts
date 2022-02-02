import path from "path";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { FieldLogLevel, Schema } from "@aws-cdk/aws-appsync-alpha";
import { CfnOutput, Duration, Expiration, RemovalPolicy } from "aws-cdk-lib";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { Lambda } from "./lambda";

interface Props {
  postsTable: ddb.ITable;
  usersTable: ddb.ITable;
}

export class AppApi extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "Api",
      schema: Schema.fromAsset(path.join(__dirname, "..", "graphql", "schema.graphql")),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
        excludeVerboseContent: true,
      },
    });
    new LogGroup(this, "ApiLogGroup", {
      logGroupName: "/aws/appsync/apis/" + api.apiId,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_WEEK,
    });

    // DATA SOURCES
    const usersTableSource = api.addDynamoDbDataSource("UsersTableSource", props.usersTable);
    usersTableSource.createResolver({
      typeName: "Query",
      fieldName: "getUsers",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });
    usersTableSource.createResolver({
      typeName: "Query",
      fieldName: "getUserById",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem("id", "userId"),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    usersTableSource.createResolver({
      typeName: "Post",
      fieldName: "author",
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `{"version": "2017-02-28", "operation": "GetItem", "key": {"id": $util.dynamodb.toDynamoDBJson($ctx.source.authorId)}}`
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    const postsTableSource = api.addDynamoDbDataSource("PostsTableSource", props.postsTable);
    postsTableSource.createResolver({
      typeName: "Query",
      fieldName: "getPosts",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });
    postsTableSource.createResolver({
      typeName: "Query",
      fieldName: "getPostById",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem("id", "postId"),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    postsTableSource.createResolver({
      typeName: "User",
      fieldName: "posts",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($ctx.source.postIds.size() == 0)
          #return([])
        #end

        #set($postIds = [])
        #foreach($postId in $ctx.source.postIds)
          #set($map = {})
          $util.qr($map.put("id", $util.dynamodb.toString($postId)))
          $util.qr($postIds.add($map))
        #end

        {
          "version" : "2018-05-29",
          "operation" : "BatchGetItem",
          "tables" : {
             "${props.postsTable.tableName}": {
               "keys": $util.toJson($postIds),
               "consistentRead": true
             }
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `$util.toJson($ctx.result.data["${props.postsTable.tableName}"])`
      ),
    });

    const resolverLambda = new Lambda(this, "ResolverLambda", {
      entry: path.join(__dirname, "..", "lambda", "posts.handler.ts"),
      environment: {
        POSTS_TABLE_NAME: props.postsTable.tableName,
        USERS_TABLE_NAME: props.usersTable.tableName,
      },
    });

    const lambdaDs = api.addLambdaDataSource("LambdaDataSource", resolverLambda);
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createUser",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createPost",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updatePost",
    });

    props.usersTable.grantFullAccess(resolverLambda);
    props.postsTable.grantFullAccess(resolverLambda);

    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });
    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });
  }
}
