import { CommentFragment } from "../../lib/api/api.generated";
import { COMMENT_AUTHOR } from "./user";
import { EXISTING_COMMENT_RESPONSE, NEW_COMMENT_RESPONSE } from "./comment-response";

export const EXISTING_COMMENT: CommentFragment = {
  id: "24q8eEmizVRa2VYpoGnaTqImfqK",
  content: "Existing MOCK comment",
  post: {
    id: "24XoHqTWe6dG9tleycdjacOAis2",
    title: "RARt",
    content:
      'Officia tempor fugiat <mark data-comment-id="24q8eEmizVRa2VYpoGnaTqImfqK">dolore adipiscing sunt.</mark> Occaecat deserunt dolore laborum lorem elit mollit in, consectetur tempor pariatur consequat excepteur, aliquip reprehenderit tempor pariatur culpa sunt ut. Officia laboris deserunt nisi, reprehenderit voluptate elit magna non ex ex. Mollit ea sint dolore mollit et mollit esse.',
  },
  author: COMMENT_AUTHOR,
  responses: [EXISTING_COMMENT_RESPONSE],
  firstCreated: "2022-02-08T19:00:49.700Z",
  lastUpdated: null,
};

export const EXISTING_COMMENT_WITH_NEW_RESPONSE: CommentFragment = {
  ...EXISTING_COMMENT,
  responses: [EXISTING_COMMENT_RESPONSE, NEW_COMMENT_RESPONSE],
  lastUpdated: "2022-02-08T19:20:15.700Z",
};

export const NEW_COMMENT: CommentFragment = {
  id: "24q8eEmizVRa2VYpoGnaTqabcd",
  content: "This is a comment.",
  post: {
    id: "24XoHqTWe6dG9tleycdjacOAis2",
    title: "RARt",
    content:
      'Officia tempor fugiat <mark data-comment-id="24q8eEmizVRa2VYpoGnaTqabcd"><mark data-comment-id="24q8eEmizVRa2VYpoGnaTqImfqK">dolore adipiscing sunt.</mark> Occaecat deserunt dolore laborum lorem elit mollit in, consectetur tempor pariatur consequat excepteur, aliquip reprehenderit tempor pariatur culpa sunt ut. Officia laboris deserunt nisi, reprehenderit voluptate elit magna non ex ex. Mollit ea sint dolore mollit et mollit esse.</mark>',
  },
  author: COMMENT_AUTHOR,
  responses: [],
  firstCreated: "2022-02-08T19:10:49.700Z",
  lastUpdated: null,
};
