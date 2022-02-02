import type { AppSyncResolverHandler } from "aws-lambda";
import { addComment } from "./resolvers/addComment";
import { createPost } from "./resolvers/createPost";
import { createUser } from "./resolvers/createUser";
import { updatePost } from "./resolvers/updatePost";
import {
  AddCommentInput,
  Comment,
  CreatePostInput,
  CreateUserInput,
  Post,
  UpdatePostInput,
  User,
} from "./types.generated";

const handler: AppSyncResolverHandler<
  { input: CreateUserInput | CreatePostInput | UpdatePostInput | AddCommentInput },
  User | Post | Comment
> = async (event) => {
  console.log(event);
  switch (event.info.fieldName) {
    case "createUser":
      return createUser(event.arguments.input as CreateUserInput);
    case "createPost":
      return createPost(event.arguments.input as CreatePostInput);
    case "updatePost":
      return updatePost(event.arguments.input as UpdatePostInput);
    case "addComment":
      return addComment(event.arguments.input as AddCommentInput);
    default:
      throw new Error(`Unsupported operation: ${event.info.fieldName}`);
  }
};

exports.handler = handler;
