import React, { ReactElement } from "react";
import { Comment } from "./Comment";
import { usePost } from "../../hooks/use-post";

export const Comments = (): ReactElement => {
  const { comments, selectedComment, selectComment, isAddingNewComment } = usePost();

  if (isAddingNewComment)
    return (
      <section>
        <h2 className="text-lg font-semibold">Adding a new comment</h2>
        <p className="text-gray-500">{comments.length} comments already exist.</p>
      </section>
    );

  return (
    <section>
      <h2 className="text-lg font-semibold">{comments.length} comments</h2>
      <ul className="mt-8 flex flex-col space-y-3">
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
    </section>
  );
};
