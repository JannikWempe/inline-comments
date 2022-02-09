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

    const newPostContent = removeCommentMark(post.content, input.commentId);
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
              UpdateExpression: `REMOVE #commentIds[${commentIdx}] SET #content = :content, #lastUpdated = :lastUpdated`,
              ExpressionAttributeNames: {
                "#commentIds": "commentIds",
                "#content": "content",
                "#lastUpdated": "lastUpdated",
              },
              ExpressionAttributeValues: {
                ":content": newPostContent,
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

const removeCommentMark = (postContent: string, commentId: string) => {
  const commentMarkPattern = new RegExp(`<mark [^\\/]*?data-comment-id="${commentId}"+?.*?>(.*?)<\\/mark>`, "g");

  const commentMarksAmount = postContent.match(commentMarkPattern)?.length ?? 0;
  if (commentMarksAmount !== 1)
    throw new Error(`Expected exactly one comment with id ${commentId} but got ${commentMarksAmount}.`);

  return postContent.replace(commentMarkPattern, `$1`);
};
