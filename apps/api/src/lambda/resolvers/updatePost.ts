import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { UpdatePostInput } from "../types.generated";

export const updatePost = async (input: UpdatePostInput) => {
  try {
    const lastUpdated = new Date().toISOString();

    // TODO: remove comment from ddb given it is not included in content anymore; or TTL?

    const postRes = await docClient
      .update({
        TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
        Key: {
          id: input.id,
        },
        UpdateExpression: "SET #title = :title, #content = :content, #lastUpdated = :lastUpdated",
        ExpressionAttributeNames: {
          "#title": "title",
          "#content": "content",
          "#lastUpdated": "lastUpdated",
        },
        ExpressionAttributeValues: {
          ":title": input.title,
          ":content": input.content,
          ":lastUpdated": lastUpdated,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    return postRes.Attributes;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
