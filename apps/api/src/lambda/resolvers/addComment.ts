import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { AddCommentInput, Comment, Post, User } from "../types.generated";

export const addComment = async (input: AddCommentInput): Promise<Comment> => {
  const Item = {
    id: ksuid.randomSync().string,
    content: input.content,
    postId: input.postId,
    authorId: input.authorId,
    replies: [],
    firstCreated: new Date().toISOString(),
    lastUpdated: null,
  };

  try {
    const [author, post] = await Promise.all([getUserById(input.authorId), getPostById(input.postId)]);

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
              UpdateExpression: "SET #commentIds = list_append(if_not_exists(#commentIds, :empty_list), :comment)",
              ExpressionAttributeNames: {
                "#commentIds": "commentIds",
              },
              ExpressionAttributeValues: {
                ":comment": [Item.id],
                ":empty_list": [],
              },
            },
          },
        ],
      })
      .promise();

    const { authorId, postId, ...createdComment } = { ...Item, author, post };
    return createdComment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getUserById = async (userId: string): Promise<User> => {
  const res = await docClient
    .get({
      TableName: getEnvOrThrow("USERS_TABLE_NAME"),
      Key: {
        id: userId,
      },
    })
    .promise();
  const user = res.Item as User;
  if (!user) {
    throw new Error(`User with id ${userId} not found.`);
  }
  return user as User;
};

const getPostById = async (postId: string): Promise<Post> => {
  const res = await docClient
    .get({
      TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
      Key: {
        id: postId,
      },
    })
    .promise();
  const post = res.Item as Post;
  if (!post) {
    throw new Error(`Post with id ${postId} not found.`);
  }
  return post;
};
