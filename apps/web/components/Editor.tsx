import type { ReactElement } from "react";
import React, { useRef, useState } from "react";
import { useDebounce } from "react-use";
import { useQueryClient } from "react-query";
import { PostFragment, usePostQuery, useUpdatePostMutation } from "../lib/api/api.generated";
import { useApplyCommentMarkerConnection } from "../hooks/use-apply-comment-marker-connection";

type Props = {
  post: PostFragment;
  className?: string;
};

export const Editor = React.memo(
  ({ post, className }: Props): ReactElement => {
    useApplyCommentMarkerConnection();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const queryClient = useQueryClient();
    const updatePostMutation = useUpdatePostMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(usePostQuery.getKey({ id: post.id }));
      },
    });

    const contentRef = useRef<HTMLPreElement>(null);

    useDebounce(
      () => {
        updatePostMutation.mutate({ id: post.id, title, content });
      },
      1000,
      [title, content]
    );

    return (
      <div className={`flex flex-col space-y-3 items-center ${className}`}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="w-full p-2 font-semibold rounded-lg border-solid border-2 border-gray-100 focus:outline-2"
        />
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions  */}
        <pre
          ref={contentRef}
          className="highlight-comments w-full p-2 whitespace-pre-wrap rounded-lg border-solid border-2 border-gray-100 selection:bg-blue-500/20"
          contentEditable
          onInput={(e) => {
            setContent(e.currentTarget.innerHTML);
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    );
  },
  // excluding content from rerendering this component; a rerender leads to cursor jumping
  (prev, next) => prev.post.id === next.post.id && prev.post.comments.length === next.post.comments.length
);
