import path from "path";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { FieldLogLevel, Schema } from "@aws-cdk/aws-appsync-alpha";
import { CfnOutput, Duration, Expiration, RemovalPolicy, Stack } from "aws-cdk-lib";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { Lambda } from "./lambda";

interface Props {
  postsTable: ddb.ITable;
  usersTable: ddb.ITable;
  commentsTable: ddb.ITable;
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
    const userByAuthorIdTemplates = {
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `{"version": "2017-02-28", "operation": "GetItem", "key": {"id": $util.dynamodb.toDynamoDBJson($ctx.source.authorId)}}`
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    };
    usersTableSource.createResolver({
      typeName: "Post",
      fieldName: "author",
      ...userByAuthorIdTemplates,
    });
    usersTableSource.createResolver({
      typeName: "CommentResponse",
      fieldName: "author",
      ...userByAuthorIdTemplates,
    });
    usersTableSource.createResolver({
      typeName: "Comment",
      fieldName: "author",
      ...userByAuthorIdTemplates,
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
        #if($util.isNullOrEmpty($ctx.source.postIds) || $ctx.source.postIds.size() == 0)
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
    postsTableSource.createResolver({
      typeName: "Comment",
      fieldName: "post",
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `{"version": "2017-02-28", "operation": "GetItem", "key": {"id": $util.dynamodb.toDynamoDBJson($ctx.source.postId)}}`
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    const commentsTableSource = api.addDynamoDbDataSource("CommentsTableSource", props.commentsTable);
    commentsTableSource.createResolver({
      typeName: "Post",
      fieldName: "comments",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($util.isNullOrEmpty($ctx.source.commentIds) || $ctx.source.commentIds.size() == 0)
          #return([])
        #end

        #set($commentIds = [])
        #foreach($commentId in $ctx.source.commentIds)
          #set($map = {})
          $util.qr($map.put("id", $util.dynamodb.toString($commentId)))
          $util.qr($commentIds.add($map))
        #end

        {
          "version" : "2018-05-29",
          "operation" : "BatchGetItem",
          "tables" : {
             "${props.commentsTable.tableName}": {
               "keys": $util.toJson($commentIds),
               "consistentRead": true
             }
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `$util.toJson($ctx.result.data["${props.commentsTable.tableName}"])`
      ),
    });

    const resolverLambda = new Lambda(this, "ResolverLambda", {
      entry: path.join(__dirname, "..", "lambda", "posts.handler.ts"),
      environment: {
        POSTS_TABLE_NAME: props.postsTable.tableName,
        USERS_TABLE_NAME: props.usersTable.tableName,
        COMMENTS_TABLE_NAME: props.commentsTable.tableName,
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
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addComment",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteComment",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addCommentResponse",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteCommentResponse",
    });

    props.usersTable.grantFullAccess(resolverLambda);
    props.postsTable.grantFullAccess(resolverLambda);
    props.commentsTable.grantFullAccess(resolverLambda);

    // names taken from amplify: https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/
    // FIXME: exportName doesn't keep the output json property stable
    new CfnOutput(this, "AwsAppsyncGraphqlEndpoint", {
      exportName: "AwsAppsyncGraphqlEndpoint",
      value: api.graphqlUrl,
    });
    new CfnOutput(this, "AwsAppsyncApiKey", {
      exportName: "AwsAppsyncApiKey",
      value: api.apiKey || "",
    });
    new CfnOutput(this, "AwsAppsyncAuthenticationType", {
      exportName: "AwsAppsyncAuthenticationType",
      value: "API_KEY",
    });
    new CfnOutput(this, "AwsAppsyncRegion", {
      exportName: "AwsAppsyncRegion",
      value: Stack.of(this).region,
    });
  }
}
