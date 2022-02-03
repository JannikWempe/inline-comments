import type { AppSyncResolverHandler } from "aws-lambda";
import { isOfType } from "./lib/utilities";
import { addComment } from "./resolvers/addComment";
import { createPost } from "./resolvers/createPost";
import { createUser } from "./resolvers/createUser";
import { deleteComment } from "./resolvers/deleteComment";
import { updatePost } from "./resolvers/updatePost";
import {
  AddCommentInput,
  Comment,
  CreatePostInput,
  CreateUserInput,
  MutationAddCommentArgs,
  MutationCreatePostArgs,
  MutationCreateUserArgs,
  MutationUpdatePostArgs,
  Post,
  UpdatePostInput,
  User,
} from "./types.generated";

const handler: AppSyncResolverHandler<
  | MutationCreateUserArgs
  | MutationCreatePostArgs
  | MutationUpdatePostArgs
  | MutationAddCommentArgs,
  User | Post | Comment
> = async (event) => {
  console.log(event);
  switch (event.info.fieldName) {
    case "createUser":
      assertHasInput(event.arguments);
      assertIsOfType<CreateUserInput>(event.arguments.input, "username");
      return createUser(event.arguments.input);
    case "createPost":
      assertHasInput(event.arguments);
      assertIsOfType<CreatePostInput>(event.arguments.input, "title", "content", "authorId");
      return createPost(event.arguments.input);
    case "updatePost":
      assertHasInput(event.arguments);
      assertIsOfType<UpdatePostInput>(event.arguments.input, "id", "title", "content");
      return updatePost(event.arguments.input);
    case "addComment":
      assertHasInput(event.arguments);
      assertIsOfType<AddCommentInput>(event.arguments.input, "content", "postId", "authorId");
      return addComment(event.arguments.input);
    default:
      throw new Error(`Unsupported operation: ${event.info.fieldName}`);
  }
};

exports.handler = handler;

function assertHasInput(varToBeChecked: unknown): asserts varToBeChecked is { input: unknown } {
  if (!isOfType<{ input: unknown }>(varToBeChecked, "input")) {
    throw new Error(`Expected arguments to have input property.`);
  }
}

function assertIsOfType<T>(varToBeChecked: unknown, ...propertiesToCheck: (keyof T)[]): asserts varToBeChecked is T {
  if (!isOfType(varToBeChecked, ...propertiesToCheck)) {
    throw new Error(`Expected ${varToBeChecked} to have the following properties: ${propertiesToCheck.join(", ")}.`);
  }
}
