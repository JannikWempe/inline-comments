import React, { ReactElement, useRef, useState } from "react";
import { AnnotationIcon } from "ui/AnnotationIcon";
import { useClickAway } from "react-use";
import { PostFragment } from "../lib/api/api.generated";
import { useDisclosure } from "../hooks/use-disclosure";
import { NewComment } from "./NewComment";
import { usePost } from "../hooks/use-post";
import { useApplyCommentMarkerConnection } from "../hooks/use-apply-comment-marker-connection";

type Point = {
  x: number;
  y: number;
};

type Props = {
  post: PostFragment;
  className?: string;
};

const getRange = () => {
  if (!window) return undefined;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return undefined;
  return selection.getRangeAt(0);
};

export const Annotator = ({ post, className }: Props): ReactElement => {
  useApplyCommentMarkerConnection();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setIsAddingNewComment } = usePost();
  const [menuPosition, setMenuPosition] = useState<Point | null>(null);
  const contentRef = useRef<HTMLPreElement>(null);

  const rangeRef = useRef<Range | null>(null);
  const createdHighlight = useRef<HTMLElement | null>(null);

  useClickAway(contentRef, () => {
    // otherwise button is hidden before event is triggered
    setTimeout(() => {
      rangeRef.current = null;
      setMenuPosition(null);
    }, 200);
  });

  const handleMouseUp = () => {
    const range = getRange();
    if (!range || range.toString() === "") {
      setMenuPosition(null);
      return;
    }
    rangeRef.current = range;

    const rect = range.getBoundingClientRect();

    const buttonWidth = 20;
    const buttonHeight = 20;
    const lineHeight = 15;
    setMenuPosition({
      x: rect.x + rect.width / 2 - buttonWidth - 80,
      y: rect.y - 2 * buttonHeight - lineHeight - 17,
    });
  };

  const handleAddComment = () => {
    if (!rangeRef.current || !contentRef.current) return;

    const highlight = document.createElement("mark");
    highlight.dataset.newComment = "true";
    highlight.classList.add("bg-blue-500/50");
    createdHighlight.current = highlight;
    setIsAddingNewComment(true);
    onOpen();
    try {
      rangeRef.current.surroundContents(highlight);
    } catch (e) {
      // fails in case of partial overlap, e.g. <mark1>some <mark2>text</mark1> text</mark2>
      // TODO: handle this case gracefully; e.g. merge comments?
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const resetContent = () => {
    if (!contentRef.current) return;
    contentRef.current.innerHTML = post.content;
  };

  const handleCancelCommenting = () => {
    onClose();
    resetContent();
    setIsAddingNewComment(false);
  };

  const onDoneCommenting = () => {
    // contentRef.current.innerHTML = data.addComment.post.content;
    createdHighlight.current = null;
    setIsAddingNewComment(false);
    onClose();
  };

  return (
    <div className={`flex flex-col space-y-3 items-center ${className}`}>
      <input
        type="text"
        value={post.title}
        readOnly
        className="w-full p-2 font-semibold rounded-lg border-solid border-2 border-gray-100 focus:outline-2"
      />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <pre
        className="highlight-comments relative w-full p-2 whitespace-pre-wrap rounded-lg border-solid border-2 border-gray-100 selection:bg-blue-500/20"
        onMouseUp={handleMouseUp}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: post.content }}
        data-testid="annotator-content"
      />
      <NewComment
        postId={post.id}
        postContent={contentRef.current?.innerHTML ?? ""}
        isOpen={isOpen}
        onDone={onDoneCommenting}
        onCancel={handleCancelCommenting}
        className="absolute right-0 w-[30vw]"
      />
      <button
        type="button"
        aria-label="Add comment"
        className={`${menuPosition ? `block absolute p-2 bg-gray-500 text-white` : "hidden"}`}
        style={{
          top: menuPosition ? menuPosition.y : undefined,
          left: menuPosition?.x,
        }}
        onClick={handleAddComment}
      >
        <AnnotationIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
