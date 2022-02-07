import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { CommentFragment, PostFragment, useUpdatePostMutation } from "../lib/api/api.generated";
import { usePost } from "../hooks/use-post";

type Props = {
  post: PostFragment;
  className?: string;
};

const getAllCommentEls = (): NodeListOf<Element> | null => document.querySelectorAll(`pre > mark[data-comment-id]`);
const getSelectedCommentEl = (selectedCommentId: CommentFragment["id"]): Element | null =>
  document.querySelector(`pre > mark[data-comment-id="${selectedCommentId}"]`);

export const Editor = ({ post, className }: Props): ReactElement => {
  const { selectComment, selectedComment } = usePost();
  const [title, setTitle] = useState(() => post.title);
  const [content, setContent] = useState(() => post.content);
  const updatePostMutation = useUpdatePostMutation();

  useDebounce(
    () => {
      updatePostMutation.mutate({ id: post.id, title, content });
    },
    1000,
    [title, content]
  );

  useEffect(() => {
    getAllCommentEls()?.forEach((comment) => {
      comment.classList.remove("!bg-red-500/50");
    });

    if (selectedComment) {
      getSelectedCommentEl(selectedComment.id)?.classList.add("!bg-red-500/50");
    }
  }, [post, selectedComment]);

  useEffect(() => {
    const abortController = new AbortController();

    const onMouseEnter = (commentEl: Element) => () => {
      const commentId = commentEl.getAttribute("data-comment-id");
      if (commentId) {
        selectComment(commentId);
      }
    };

    const onMouseLeave = () => {
      selectComment(null);
    };

    getAllCommentEls().forEach((comment) => {
      comment.addEventListener("mouseenter", onMouseEnter(comment), { signal: abortController.signal });
      comment.addEventListener("mouseleave", onMouseLeave, { signal: abortController.signal });
    });

    return () => {
      abortController.abort();
    };
  }, [selectComment]);

  return (
    <div className={`flex flex-col space-y-3 items-center ${className}`}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        className="w-full p-2 font-semibold rounded-lg border-solid border-2 border-gray-100 focus:outline-2"
      />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <pre
        className="highlight-comments p-2 whitespace-pre-wrap rounded-lg border-solid border-2 border-gray-100 selection:bg-blue-500/20"
        contentEditable
        onInput={(e) => {
          setContent(e.currentTarget.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};
