import React, { useEffect, useRef } from "react";
import { Button, Input } from "ui";

type Props = {
  isVisible: boolean;
  newResponse: string;
  setNewResponse: (newResponse: string) => void;
  onSend: () => void;
  onCancel: () => void;
  isSending: boolean;
};

export const CommentResponseForm = ({ isVisible, newResponse, setNewResponse, onSend, isSending, onCancel }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };

  if (!isVisible) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-3 mx-2 p-2 rounded-md bg-blue-100">
      <Input ref={inputRef} labelText="Response" name="response" onChange={setNewResponse} value={newResponse} />
      <div className="flex space-x-3">
        <Button onClick={onSend} disabled={isSending} className="mt-2">
          Send
        </Button>
        <Button variant="secondary" onClick={onCancel} className="mt-2">
          Cancel
        </Button>
      </div>
    </form>
  );
};
