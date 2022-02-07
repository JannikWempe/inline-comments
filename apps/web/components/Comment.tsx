import React, { ReactElement } from "react";
import { CommentFragment } from "../lib/api/api.generated";

type Props = {
  comment: CommentFragment;
  isSelected: boolean;
  selectComment: () => void;
  deselectComment: () => void;
};

const dateTimeFormat = Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const Comment = ({ comment, isSelected, selectComment, deselectComment }: Props): ReactElement => {
  const date = dateTimeFormat.format(new Date(comment.firstCreated));

  return (
    <article
      className={`p-3 bg-gray-50 rounded-md shadow transition ${isSelected ? "scale-105" : ""}`}
      data-comment-id={comment.id}
      onMouseEnter={selectComment}
      onMouseLeave={deselectComment}
    >
      <p className="font-semibold text-md">{comment.author.username}</p>
      <p className="text-xs text-gray-500">{date}</p>
      <p className="mt-2">{comment.content}</p>
      <p>{comment.id}</p>
    </article>
  );
};
