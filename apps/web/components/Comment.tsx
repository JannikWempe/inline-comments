import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button, Input } from "ui";

type Props = {
  onSave: (comment: string) => void;
  onCancel: () => void;
  isOpen: boolean;
};

export const Comment = ({ isOpen, onSave, onCancel }: Props) => {
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    onCancel();
  });

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-12 p-3 rounded-lg shadow-lg h-32 w-52 bg-gray-300">
      <Input value={comment} onChange={setComment} name="comment" labelText="Comment" />
      <Button className="mt-2" onClick={() => onSave(comment)}>
        Save
      </Button>
      <Button className="mt-2" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};
