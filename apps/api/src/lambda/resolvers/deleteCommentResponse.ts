import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { DeleteCommentResponseInput } from "../types.generated";
import { DdbComment } from "../types/ddb-comment";

export const deleteCommentResponse = async (input: DeleteCommentResponseInput) => {
  try {
    const lastUpdated = new Date().toISOString();

    const comment = await getCommentById(input.commentId);
    const commentResponseIdx = (comment.responses ?? []).findIndex(
      (response) => response.id === input.commentResponseId
    );
    if (commentResponseIdx === -1) {
      throw new Error(`Comment ${input.commentId} does not have response ${input.commentResponseId}`);
    }
    console.debug(`Deleting comment response at index ${commentResponseIdx} from comment ${input.commentId}`);

    await docClient
      .update({
        TableName: getEnvOrThrow("COMMENTS_TABLE_NAME"),
        Key: {
          id: input.commentId,
        },
        UpdateExpression: `REMOVE #responses[${commentResponseIdx}] SET #lastUpdated = :lastUpdated`,
        ExpressionAttributeNames: {
          "#responses": "responses",
          "#lastUpdated": "lastUpdated",
        },
        ExpressionAttributeValues: {
          ":lastUpdated": lastUpdated,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return input.commentResponseId;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getCommentById = async (commentId: string): Promise<DdbComment> => {
  const res = await docClient
    .get({
      TableName: getEnvOrThrow("COMMENTS_TABLE_NAME"),
      Key: {
        id: commentId,
      },
    })
    .promise();
  const comment = res.Item as DdbComment;
  if (!comment) {
    throw new Error(`Comment with id ${comment} not found.`);
  }
  return comment;
};
