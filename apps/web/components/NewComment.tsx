import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button, Input } from "ui";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { dateTimeFormat } from "../lib/date";
import { PostFragment, useAddCommentMutation, usePostQuery } from "../lib/api/api.generated";

type Props = {
  postId: PostFragment["id"];
  postContent: PostFragment["id"];
  isOpen: boolean;
  onCancel: () => void;
  onDone?: () => void;
  className?: string;
};

export const NewComment = ({ postId, postContent, isOpen, onCancel, onDone, className }: Props) => {
  const router = useRouter();
  // FIXME: This is for demo purposes only.
  const authorId = (router.query.author ?? "24XoFTnzIcPSibhQjWvsziTw2Hh") as string;
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const addCommentMutation = useAddCommentMutation({
    onSuccess: async () => {
      onDone?.();
      await queryClient.invalidateQueries(usePostQuery.getKey({ id: postId }));
    },
  });

  useClickAway(ref, () => {
    onCancel();
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCommentMutation.mutate({
      input: {
        postId,
        authorId,
        content: comment,
        postContent,
      },
    });
    setComment("");
  };

  const date = dateTimeFormat.format(new Date());

  return (
    <article ref={ref} className={`p-3 bg-gray-50 rounded-md shadow ${className}`}>
      {/* FIXME: hardcoded username is for demo purposes only */}
      <p className="font-semibold text-md">[current user]</p>
      <p className="text-xs text-gray-500">{date}</p>
      <form onSubmit={handleSubmit}>
        <Input
          name="comment"
          labelText="Comment"
          value={comment}
          onChange={setComment}
          autoComplete="off"
          className="mt-3"
        />
        <div className="mt-2 flex space-x-3">
          <Button type="submit" className="mt-2">
            Save
          </Button>
          <Button variant="secondary" className="mt-2" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </article>
  );
};
