import { CommentResponseFragment } from "../../lib/api/api.generated";
import { COMMENT_AUTHOR, POST_AUTHOR } from "./user";

export const EXISTING_COMMENT_RESPONSE: CommentResponseFragment = {
  id: "24rRhtrbNmp2kG4fYA51iy276xF",
  content: "Good point!",
  author: POST_AUTHOR,
  firstCreated: "2022-02-08T19:00:49.700Z",
  lastUpdated: null,
};

export const NEW_COMMENT_RESPONSE: CommentResponseFragment = {
  id: "24spoaS5ykLkpdEjJBxJjUfvRxy",
  content: "Lets do it!",
  author: COMMENT_AUTHOR,
  firstCreated: "2022-02-08T19:12:49.850Z",
  lastUpdated: null,
};
