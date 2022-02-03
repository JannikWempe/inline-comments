import { User } from "../types.generated";

export type DdbUser = Omit<User, "posts"> & {
  postIds?: string[];
};
