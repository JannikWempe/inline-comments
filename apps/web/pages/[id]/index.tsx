import React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { Comments } from "components/Comments";
import { Spinner } from "ui";
import { useIsFetching } from "react-query";
import { usePostQuery, useUpdatePostMutation } from "../../lib/api/api.generated";
import { Annotator } from "../../components/Annotator";
import { Editor } from "../../components/Editor";
import { CommentsProvider } from "../../hooks/use-post";

type Props = {
  id: string;
};

const Post = ({ id }: Props) => {
  const router = useRouter();
  const query = usePostQuery({ id });
  const updatePostMutation = useUpdatePostMutation();
  const isFetching = useIsFetching();

  const editorMode = router.query.mode === "edit" ? "edit" : "review";

  return (
    <CommentsProvider postId={id}>
      <>
        {query.isLoading || updatePostMutation.isLoading || isFetching ? (
          <Spinner className="absolute top-5 left-20" />
        ) : null}
        <div className="relative mt-5 mx-20 grid grid-cols-12 gap-x-5">
          <main className="col-span-8 flex flex-col items-center">
            <h2 className="text-lg">
              Mode: <strong>{editorMode}</strong>
            </h2>
            {query.isSuccess && editorMode === "edit" && (
              <Editor post={query.data.getPostById} className="self-stretch mt-16" />
            )}

            {query.isSuccess && editorMode === "review" && (
              <Annotator post={query.data.getPostById} className="self-stretch mt-16" />
            )}
          </main>
          <aside className="col-span-4">{query.isSuccess && <Comments />}</aside>
        </div>
      </>
    </CommentsProvider>
  );
};

export default Post;

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }) => {
  return {
    props: {
      id: params.id,
    },
  };
};
