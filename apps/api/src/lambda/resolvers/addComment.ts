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

  // TODO: only allow adding <mark />; forbid changing text

  try {
    // just for validation
    await Promise.all([getUserById(input.authorId), getPostById(input.postId)]);
    const newPostContent = assignNewCommentId(input.postContent, Item.id);
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
                "SET #content = :content, #commentIds = list_append(if_not_exists(#commentIds, :emptyList), :comment), #lastUpdated = :lastUpdated",
              ExpressionAttributeNames: {
                "#content": "content",
                "#commentIds": "commentIds",
                "#lastUpdated": "lastUpdated",
              },
              ExpressionAttributeValues: {
                ":content": newPostContent,
                ":comment": [Item.id],
                ":emptyList": [],
                ":lastUpdated": lastUpdated,
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

export const assignNewCommentId = (postContent: string, commentId: string) => {
  // matches mark-tags with data-new-comment="true"
  const newCommentMark = /<mark [^\/]*?data-new-comment="true"+?.*?>(.*?)<\/mark>/g;

  const newCommentsAmount = postContent.match(newCommentMark)?.length ?? 0;
  if (newCommentsAmount != 1) throw new Error(`Expected exactly one new comment but got ${newCommentsAmount}.`);

  return postContent.replace(newCommentMark, `<mark data-comment-id="${commentId}">$1</mark>`);
};
