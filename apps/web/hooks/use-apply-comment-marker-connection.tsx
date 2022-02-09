import { useEffect } from "react";
import { usePost } from "./use-post";
import { CommentFragment } from "../lib/api/api.generated";

const getAllCommentEls = (): NodeListOf<Element> | null => document.querySelectorAll(`pre > mark[data-comment-id]`);
const getSelectedCommentEl = (selectedCommentId: CommentFragment["id"]): Element | null =>
  document.querySelector(`pre > mark[data-comment-id="${selectedCommentId}"]`);

/** *
 * Sets up the connection between the comment and the comment marker.
 */
export const useApplyCommentMarkerConnection = () => {
  const { selectComment, selectedComment } = usePost();

  useEffect(() => {
    getAllCommentEls()?.forEach((comment) => {
      comment.classList.remove("!bg-red-500/50");
    });

    if (selectedComment) {
      getSelectedCommentEl(selectedComment.id)?.classList.add("!bg-red-500/50");
    }
  }, [selectedComment]);

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
};
