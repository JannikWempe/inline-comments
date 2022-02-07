import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button, Input } from "ui";
import { dateTimeFormat } from "../lib/date";

type Props = {
  onSave: (comment: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  className?: string;
};

export const NewComment = ({ isOpen, onSave, onCancel, className }: Props) => {
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    onCancel();
  });

  if (!isOpen) return null;

  const date = dateTimeFormat.format(new Date());

  return (
    <article ref={ref} className={`p-3 bg-gray-50 rounded-md shadow ${className}`}>
      <p className="font-semibold text-md">[current user]</p>
      <p className="text-xs text-gray-500">{date}</p>
      <Input
        name="comment"
        labelText="Comment"
        value={comment}
        onChange={setComment}
        autoComplete="off"
        className="mt-3"
      />
      <div className="mt-2 flex space-x-3">
        <Button
          className="mt-2"
          onClick={() => {
            setComment("");
            onSave(comment);
          }}
        >
          Save
        </Button>
        <Button variant="secondary" className="mt-2" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </article>
  );
};
