import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { AddCommentResponseInput } from "../types.generated";

export const addCommentResponse = async (input: AddCommentResponseInput) => {
  const Item = {
    id: ksuid.randomSync().string,
    content: input.content,
    authorId: input.authorId,
    firstCreated: new Date().toISOString(),
    lastUpdated: null,
  };

  try {
    const lastUpdated = new Date().toISOString();
    await docClient
      .update({
        TableName: getEnvOrThrow("COMMENTS_TABLE_NAME"),
        Key: {
          id: input.commentId,
        },
        UpdateExpression:
          "SET #responses = list_append(if_not_exists(#responses, :emptyList), :response), #lastUpdated = :lastUpdated",
        ExpressionAttributeNames: {
          "#responses": "responses",
          "#lastUpdated": "lastUpdated",
        },
        ExpressionAttributeValues: {
          ":response": [Item],
          ":emptyList": [],
          ":lastUpdated": lastUpdated,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return Item;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
