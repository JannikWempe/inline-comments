import Link from "next/link";
import React from "react";
import { usePostsQuery } from "../lib/api/api.generated";

const Web = () => {
  const query = usePostsQuery();

  return (
    <div>
      <h1>Web</h1>
      {query.isSuccess &&
        query.data.getPosts.map((post) => (
          <Link key={post.id} href={`/${post.id}`} passHref>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="block">{post.title}</a>
          </Link>
        ))}
    </div>
  );
};

export default Web;
