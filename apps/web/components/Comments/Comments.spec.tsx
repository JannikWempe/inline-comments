import React from "react";
import { Comments } from "./Comments";
import { CommentFragment } from "../../lib/api/api.generated";
import { render, screen } from "../../lib/testhelper";

const comments: CommentFragment[] = [
  // @ts-expect-error - missing post
  {
    id: "1",
    content: "Comment 1",
    responses: [],
    firstCreated: "2020-01-01T00:00:00.000Z",
    author: {
      id: "1",
      username: "user1",
    },
  },
  // @ts-expect-error - missing post
  {
    id: "2",
    content: "Comment 2",
    responses: [],
    firstCreated: "2020-01-01T00:00:00.000Z",
    author: {
      id: "1",
      username: "user1",
    },
  },
];

jest.mock("../../hooks/use-post", () => ({
  usePost: () => ({
    comments,
  }),
}));

it("should render each comment", () => {
  render(<Comments />);

  screen.getByText("Comment 1");
  screen.getByText("Comment 2");
});
