import { Comment } from "../types.generated";
import { DdbCommentResponse } from "./ddb-comment-response";

export type DdbComment = Omit<Comment, "author" | "post" | "responses"> & {
  postId: string;
  authorId: string;
  responses?: DdbCommentResponse[];
};
