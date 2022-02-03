import { Post } from "../types.generated";

export type DdbPost = Omit<Post, "commentIds"> & {
  commentIds?: string[];
};
