import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { AddCommentInput, User } from "../types.generated";
import { DdbPost } from "../types/ddb-post";
import { DdbUser } from "../types/ddb-user";

export const addComment = async (input: AddCommentInput) => {
  const Item = {
    id: ksuid.randomSync().string,
    content: input.content,
    postId: input.postId,
    authorId: input.authorId,
    responses: [],
    firstCreated: new Date().toISOString(),
    lastUpdated: null,
  };

  try {
    // just for validation
    await Promise.all([getUserById(input.authorId), getPostById(input.postId)]);

    const lastUpdated = new Date().toISOString();
    await docClient
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: getEnvOrThrow("COMMENTS_TABLE_NAME"),
              Item,
            },
          },
          {
            Update: {
              TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
              Key: {
                id: input.postId,
              },
              UpdateExpression:
                "SET #commentIds = list_append(if_not_exists(#commentIds, :empty_list), :comment), #lastUpdated = :lastUpdated",
              ExpressionAttributeNames: {
                "#commentIds": "commentIds",
              },
              ExpressionAttributeValues: {
                ":comment": [Item.id],
                ":empty_list": [],
                ":last_updated": lastUpdated,
              },
            },
          },
        ],
      })
      .promise();

    return Item;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getUserById = async (userId: string): Promise<DdbUser> => {
  const res = await docClient
    .get({
      TableName: getEnvOrThrow("USERS_TABLE_NAME"),
      Key: {
        id: userId,
      },
    })
    .promise();
  const user = res.Item as DdbUser;
  if (!user) {
    throw new Error(`User with id ${userId} not found.`);
  }
  return user as User;
};

const getPostById = async (postId: string): Promise<DdbPost> => {
  const res = await docClient
    .get({
      TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
      Key: {
        id: postId,
      },
    })
    .promise();
  const post = res.Item as DdbPost;
  if (!post) {
    throw new Error(`Post with id ${postId} not found.`);
  }
  return post;
};
