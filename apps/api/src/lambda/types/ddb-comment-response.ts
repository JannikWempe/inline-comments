import { CommentResponse } from "../types.generated";

export type DdbCommentResponse = Omit<CommentResponse, "author"> & {
  authorId: string;
};
