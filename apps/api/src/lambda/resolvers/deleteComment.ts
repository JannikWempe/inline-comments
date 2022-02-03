import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { Comment, DeleteCommentInput } from "../types.generated";
import { DdbPost } from "../types/ddb-post";

export const deleteComment = async (input: DeleteCommentInput): Promise<Comment["id"]> => {
  try {
    const post = await getPostById(input.postId);
    const commentIdx = (post.commentIds ?? []).findIndex((commentId) => commentId === input.commentId);
    if (commentIdx === -1) {
      throw new Error(`Post ${input.postId} does not have comment ${input.commentId}`);
    }
    console.debug(`Deleting comment at index ${commentIdx} from post ${input.postId}`);

    const lastUpdated = new Date().toISOString();
    await docClient
      .transactWrite({
        TransactItems: [
          {
            Delete: {
              TableName: getEnvOrThrow("COMMENTS_TABLE_NAME"),
              Key: {
                id: input.commentId,
              },
            },
          },
          {
            Update: {
              TableName: getEnvOrThrow("POSTS_TABLE_NAME"),
              Key: {
                id: input.postId,
              },
              UpdateExpression: `REMOVE #commentIds[${commentIdx}] SET #lastUpdated = :lastUpdated`,
              ExpressionAttributeNames: {
                "#commentIds": "commentIds",
                "#lastUpdated": "lastUpdated",
              },
              ExpressionAttributeValues: {
                ":lastUpdated": lastUpdated,
              },
            },
          },
        ],
      })
      .promise();

    return input.commentId;
  } catch (err) {
    console.error(err);
    throw err;
  }
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
