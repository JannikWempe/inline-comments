import type { AppSyncResolverHandler } from "aws-lambda";
import { isOfType } from "./lib/utilities";
import { addComment } from "./resolvers/addComment";
import { addCommentResponse } from "./resolvers/addCommentResponse";
import { createPost } from "./resolvers/createPost";
import { createUser } from "./resolvers/createUser";
import { deleteComment } from "./resolvers/deleteComment";
import { deleteCommentResponse } from "./resolvers/deleteCommentResponse";
import { updatePost } from "./resolvers/updatePost";
import {
  AddCommentInput,
  AddCommentResponseInput,
  CreatePostInput,
  CreateUserInput,
  DeleteCommentInput,
  DeleteCommentResponseInput,
  MutationAddCommentArgs,
  MutationCreatePostArgs,
  MutationCreateUserArgs,
  MutationDeleteCommentArgs,
  MutationUpdatePostArgs,
  UpdatePostInput,
} from "./types.generated";

const handler: AppSyncResolverHandler<
  | MutationCreateUserArgs
  | MutationCreatePostArgs
  | MutationUpdatePostArgs
  | MutationAddCommentArgs
  | MutationDeleteCommentArgs,
  // Don't have to return GraphQL types, resolvers will resolve ids etc.
  // User | Post | Comment | Comment["id"]
  any
> = async (event) => {
  console.log(event);

  const response = await createResponse(event);
  // FIXME: replace with actual logger, e.g. ambda-powertools-logger
  console.debug(JSON.stringify(response, null, 2));

  return response;
};

const createResponse = (event: Parameters<typeof handler>[0]) => {
  assertHasInput(event.arguments);

  switch (event.info.fieldName) {
    case "createUser":
      assertInputIsOfType<CreateUserInput>(event.arguments.input, "username");
      return createUser(event.arguments.input);
    case "createPost":
      assertInputIsOfType<CreatePostInput>(event.arguments.input, "title", "content", "authorId");
      return createPost(event.arguments.input);
    case "updatePost":
      assertInputIsOfType<UpdatePostInput>(event.arguments.input, "id", "title", "content");
      return updatePost(event.arguments.input);
    case "addComment":
      assertInputIsOfType<AddCommentInput>(event.arguments.input, "content", "postId", "authorId");
      return addComment(event.arguments.input);
    case "deleteComment":
      assertInputIsOfType<DeleteCommentInput>(event.arguments.input, "commentId", "postId");
      return deleteComment(event.arguments.input);
    case "addCommentResponse":
      assertInputIsOfType<AddCommentResponseInput>(event.arguments.input, "commentId", "authorId", "content");
      return addCommentResponse(event.arguments.input);
    case "deleteCommentResponse":
      assertInputIsOfType<DeleteCommentResponseInput>(event.arguments.input, "commentId", "commentResponseId");
      return deleteCommentResponse(event.arguments.input);
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

function assertInputIsOfType<T>(
  varToBeChecked: unknown,
  ...propertiesToCheck: (keyof T)[]
): asserts varToBeChecked is T {
  if (!isOfType(varToBeChecked, ...propertiesToCheck)) {
    throw new Error(`Expected input to have the following properties: ${propertiesToCheck.join(", ")}.`);
  }
}
