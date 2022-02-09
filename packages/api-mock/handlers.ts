import {graphql} from "msw";
import {EXISTING_COMMENT, NEW_COMMENT} from "./data/comment";
import {POST_WITH_EXISTING_COMMENT} from "./data/post";
import {NEW_COMMENT_RESPONSE} from "./data/comment-response";

export const handlers = [
  graphql.query("Post", (req, res, ctx) => {
    return res(
      ctx.data({
        getPostById: POST_WITH_EXISTING_COMMENT,
      })
    );
  }),
  graphql.query("Posts", (req, res, ctx) => {
    return res(
      ctx.data({
        data: {
          getPostById: {
            id: "24XoHqTWe6dG9tleycdjacOAis2",
            title: "RARt",
            content: `MOCKConsequat quis non <mark data-comment-id="24ofpcSC5ZtpMQv2PofU3EDJiLN"><mark data-comment-id="24ofoEOztFFcnVNMGSKVXp0olfF">excepteur</mark> anim. Enim cupidatat eiusmod qui. Eiusmod eiusmod labore labore lorem labore est ea. Ullamco sit esse cupidatat amet amet. Sit lorem ad ea cillum. Sed pariatur eiusmod mollit amet occaecat sed. Ex ad ipsum quis qui.</mark>","author":{"id":"24XoFTnzIcPSibhQjWvsziTw2Hh`,
            username: "Jannik",
          },
          comments: [],
        },
      })
    );
  }),

  graphql.mutation("AddComment", (req, res, ctx) => {
    return res(
      ctx.data({
        addComment: NEW_COMMENT,
      })
    );
  }),
  graphql.mutation("DeleteComment", (req, res, ctx) => {
    return res(ctx.data(req.variables.input.commentId ?? EXISTING_COMMENT.id));
  }),
  graphql.mutation("AddCommentResponse", (req, res, ctx) => {
    return res(
      ctx.data({
        addComment: NEW_COMMENT_RESPONSE,
      })
    );
  }),
];
