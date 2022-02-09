import React from "react";
import { CommentResponseFragment } from "../../lib/api/api.generated";
import { dateTimeFormat } from "../../lib/date";

type Props = {
  response: CommentResponseFragment;
};

export const CommentResponse = ({ response }: Props) => {
  return (
    <section key={response.id} className="mt-3 mx-2 p-2 rounded-md bg-blue-100" data-testid="comment-response">
      <p className="font-semibold text-md">{response.author.username}</p>
      <p className="text-xs text-gray-500">{dateTimeFormat.format(new Date(response.lastUpdated))}</p>
      <p className="mt-2">{response.content}</p>
    </section>
  );
};
