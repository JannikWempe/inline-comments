import React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { usePostQuery } from "../../lib/api/api.generated";
import { Annotator } from "../../components/Annotator";
import { Editor } from "../../components/Editor";

type Props = {
  id: string;
};

const Post = ({ id }: Props) => {
  const router = useRouter();
  const query = usePostQuery({ id });

  const editorMode = router.query.mode === "edit" ? "edit" : "review";

  return (
    <main className="mt-5 flex flex-col items-center">
      <h2 className="text-lg">
        Mode: <strong>{editorMode}</strong>
      </h2>
      {query.isSuccess && query?.data?.getPostById && editorMode === "edit" && (
        <Editor post={query.data.getPostById} className="w-2/3 mt-16" />
      )}

      {query.isSuccess && query?.data?.getPostById && editorMode === "review" && (
        <Annotator post={query.data.getPostById} className="w-2/3 mt-16" />
      )}
    </main>
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
