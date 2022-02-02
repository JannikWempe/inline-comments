import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { Post, UpdatePostInput } from "../types.generated";

export const updatePost = async (input: UpdatePostInput): Promise<Post> => {
  try {
    const lastUpdated = new Date().toISOString();
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
    return postRes.Attributes as Post;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
