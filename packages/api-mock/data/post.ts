import { EXISTING_COMMENT, EXISTING_COMMENT_WITH_NEW_RESPONSE, NEW_COMMENT } from "./comment";
import { PostFragment } from "../../lib/api/api.generated";
import { POST_AUTHOR } from "./user";

export const POST_WITHOUT_COMMENT: PostFragment = {
  id: "24XoHqTWe6dG9tleycdjacOAis2",
  title: "RARt",
  content:
    "THIS IS A MOCK. Officia tempor fugiat dolore adipiscing sunt. Occaecat deserunt dolore laborum lorem elit mollit in, consectetur tempor pariatur consequat excepteur, aliquip reprehenderit tempor pariatur culpa sunt ut. Officia laboris deserunt nisi, reprehenderit voluptate elit magna non ex ex. Mollit ea sint dolore mollit et mollit esse.",
  author: POST_AUTHOR,
  comments: [],
};

export const POST_WITH_EXISTING_COMMENT: PostFragment = {
  ...POST_WITHOUT_COMMENT,
  content:
    'THIS IS A MOCK. Officia tempor fugiat <mark data-comment-id="24q8eEmizVRa2VYpoGnaTqImfqK">dolore adipiscing sunt.</mark> Occaecat deserunt dolore laborum lorem elit mollit in, consectetur tempor pariatur consequat excepteur, aliquip reprehenderit tempor pariatur culpa sunt ut. Officia laboris deserunt nisi, reprehenderit voluptate elit magna non ex ex. Mollit ea sint dolore mollit et mollit esse.',
  comments: [EXISTING_COMMENT],
};

export const POST_WITH_EXISTING_AND_NEW_COMMENT: PostFragment = {
  ...POST_WITH_EXISTING_COMMENT,
  content:
    'THIS IS A MOCK. Officia tempor fugiat <mark data-comment-id="24q8eEmizVRa2VYpoGnaTqabcd"><mark data-comment-id="24q8eEmizVRa2VYpoGnaTqImfqK">dolore adipiscing sunt.</mark> Occaecat deserunt dolore laborum lorem elit mollit in, consectetur tempor pariatur consequat excepteur, aliquip reprehenderit tempor pariatur culpa sunt ut. Officia laboris deserunt nisi, reprehenderit voluptate elit magna non ex ex. Mollit ea sint dolore mollit et mollit esse.</mark>',
  comments: [...POST_WITH_EXISTING_COMMENT.comments, NEW_COMMENT],
};

export const POST_WITH_EXISTING_COMMENT_AND_NEW_RESPONSE: PostFragment = {
  ...POST_WITH_EXISTING_COMMENT,
  comments: [EXISTING_COMMENT_WITH_NEW_RESPONSE],
};
