/**
 * @jest-environment jsdom
 */
import React from "react";
import { CommentFragment } from "../../lib/api/api.generated";
import { Comment } from "./Comment";
import { render, screen } from "../../lib/testhelper";

// @ts-expect-error - missing post
const comment: CommentFragment = {
  id: "1",
  content: "Comment 1",
  responses: [],
  firstCreated: "2020-01-01T18:00:00.000Z",
  author: {
    id: "1",
    username: "user1",
  },
};

const noop = () => {};

it("should render comment data", () => {
  render(<Comment comment={comment} isSelected={false} selectComment={noop} deselectComment={noop} />);

  screen.getByText("Comment 1");
  screen.getByText("user1");
  screen.getByText("01/01/20, 19:00");
});
