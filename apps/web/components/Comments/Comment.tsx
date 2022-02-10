import React, { ReactElement, useRef, useState } from "react";
import { Spinner } from "ui";
import { useQueryClient } from "react-query";
import { TrashIcon } from "ui/icons/TrashIcon";
import { CheckIcon } from "ui/icons/CheckIcon";
import { useRouter } from "next/router";
import {
  CommentFragment,
  useAddCommentResponseMutation,
  useDeleteCommentMutation,
  usePostQuery,
} from "../../lib/api/api.generated";
import { dateTimeFormat } from "../../lib/date";
import { CommentResponseForm } from "./CommentResponseForm";
import { CommentResponse } from "./CommentResponse";

type Props = {
  comment: CommentFragment;
  isSelected: boolean;
  selectComment: () => void;
  deselectComment: () => void;
};

export const Comment = ({ comment, isSelected, selectComment, deselectComment }: Props): ReactElement => {
  const router = useRouter();
  // FIXME: This is for demo purposes only.
  const authorId = (router.query.author ?? "24XoFTnzIcPSibhQjWvsziTw2Hh") as string;
  const [newResponse, setNewResponse] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const queryClient = useQueryClient();
  const addCommentMutation = useAddCommentResponseMutation({
    onSuccess: () => {
      setNewResponse("");
      setShowResponses(true);
      queryClient.invalidateQueries(usePostQuery.getKey({ id: comment.post.id }));
    },
  });
  const deleteCommentMutation = useDeleteCommentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(usePostQuery.getKey({ id: comment.post.id }));
    },
  });

  const ref = useRef(null);

  const onSend = () => {
    addCommentMutation.mutate({
      input: {
        commentId: comment.id,
        authorId,
        content: newResponse,
      },
    });
  };

  const onDelete = () => {
    deleteCommentMutation.mutate({
      input: {
        postId: comment.post.id,
        commentId: comment.id,
      },
    });
  };

  const date = dateTimeFormat.format(new Date(comment.firstCreated));
  const isUpdatingComment = addCommentMutation.isLoading || deleteCommentMutation.isLoading;
  const hasResponses = comment.responses.length > 0;

  return (
    <article
      ref={ref}
      className={`relative p-3 bg-blue-50 rounded-md shadow transition ${isSelected ? "scale-105" : ""}`}
      data-comment-id={comment.id}
      onMouseEnter={selectComment}
      onMouseLeave={deselectComment}
      data-testid="comment"
    >
      {isUpdatingComment ? (
        <Spinner className="absolute top-3 right-3" />
      ) : (
        <>
          <button
            type="button"
            onClick={onDelete}
            disabled={isUpdatingComment}
            aria-label="mark comment as done"
            className="absolute right-10 top-3 text-green-600 hover:text-green-500 disabled:text-green-300 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isUpdatingComment}
            aria-label="delete comment"
            className="absolute right-3 top-3 text-red-600 hover:text-red-500 disabled:text-red-300 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </>
      )}
      <p className="font-semibold text-md">{comment.author.username}</p>
      <p className="text-xs text-gray-500">{date}</p>
      <p className="mt-2">{comment.content}</p>
      {(!showResponseForm || (!showResponses && hasResponses)) && (
        <div className="flex space-x-3">
          {!showResponseForm && (
            <button type="button" onClick={() => setShowResponseForm(true)} className="mt-3 text-xs text-gray-500">
              Add Response
            </button>
          )}
          {!showResponses && hasResponses && (
            <button type="button" onClick={() => setShowResponses(true)} className="mt-3 text-xs text-gray-500">
              Show {comment.responses.length} responses
            </button>
          )}
        </div>
      )}
      {showResponses && comment.responses.map((response) => <CommentResponse key={response.id} response={response} />)}
      <CommentResponseForm
        isVisible={showResponseForm}
        newResponse={newResponse}
        setNewResponse={setNewResponse}
        isSending={isUpdatingComment}
        onCancel={() => {
          setShowResponseForm(false);
          setNewResponse("");
        }}
        onSend={onSend}
      />
      {showResponses && (
        <button type="button" onClick={() => setShowResponses(false)} className="mt-3 ml-3 text-xs text-gray-500">
          Hide responses
        </button>
      )}
    </article>
  );
};
