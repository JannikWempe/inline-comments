import React, { ReactElement } from "react";
import { Comment } from "./Comment";
import { usePost } from "../hooks/use-post";

export const Comments = (): ReactElement => {
  const { comments, selectedComment, selectComment } = usePost();

  return (
    <ul className="flex flex-col space-y-3">
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment
            comment={comment}
            isSelected={comment.id === selectedComment?.id}
            selectComment={() => selectComment(comment.id)}
            deselectComment={() => selectComment(null)}
          />
        </li>
      ))}
    </ul>
  );
};
