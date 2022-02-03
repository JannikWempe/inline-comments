import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { CreatePostInput, User } from "../types.generated";

export const createPost = async (input: CreatePostInput) => {
  const Item = {
    id: ksuid.randomSync().string,
    title: input.title,
    content: input.content,
    authorId: input.authorId,
    comments: [],
    firstCreated: new Date().toISOString(),
    lastUpdated: null,
  };

  try {
    const userRes = await docClient
      .get({
        TableName: getEnvOrThrow("USERS_TABLE_NAME"),
        Key: {
          id: input.authorId,
        },
      })
      .promise();
    const author = userRes.Item as User;

    if (!author) {
      throw new Error("Author not found");
    }

    await docClient
      .put({
        TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
        Item,
      })
      .promise();

    return Item;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
