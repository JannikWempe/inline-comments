import React, { createContext, useContext, useMemo, useState } from "react";
import { UseQueryResult } from "react-query";
import { CommentFragment, PostFragment, PostQuery, usePostQuery } from "../lib/api/api.generated";

type Context = {
  query: UseQueryResult<PostQuery>;
  selectedComment: CommentFragment | null;
  setSelectedComment: (comment: CommentFragment | null) => void;
};

const CommentsContext = createContext<Partial<Context>>({});

type Props = {
  children: React.ReactElement;
  postId: PostFragment["id"];
};

export const CommentsProvider = ({ postId, children }: Props) => {
  const query = usePostQuery({ id: postId });
  const [selectedComment, setSelectedComment] = useState(null);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CommentsContext.Provider value={{ query, selectedComment, setSelectedComment }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const usePost = () => {
  const { query, selectedComment, setSelectedComment } = useContext(CommentsContext);

  /** Comments that (still) exist in the post content in order of their occurrence. */
  const comments = useMemo(
    () =>
      query.isSuccess
        ? query.data.getPostById.comments
            .filter((comment) => query.data.getPostById.content.includes(comment.id))
            .sort((commentOne, commentTwo) => {
              const commentOneIndex = query.data.getPostById.content.indexOf(commentOne.id);
              const commentTwoIndex = query.data.getPostById.content.indexOf(commentTwo.id);
              return commentOneIndex - commentTwoIndex;
            })
        : [],
    [query]
  );

  const selectComment = (commentId: CommentFragment["id"]) => {
    if (!query.data) return;
    setSelectedComment(query.data.getPostById.comments.find((comment) => comment.id === commentId) || null);
  };

  return { query, comments, selectedComment, selectComment };
};
