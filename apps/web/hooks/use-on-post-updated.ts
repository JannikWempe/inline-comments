import { useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import type { Observable } from "zen-observable-ts/lib/zenObservable";
import { OnPostUpdatedDocument, OnPostUpdatedSubscription, PostFragment } from "../lib/api/api.generated";

type Props = {
  postId: string;
  onPostUpdated: (post: PostFragment) => void;
  onPostUpdatedError?: (error: unknown) => void;
};

const isObservable = <T>(maybeObservable: unknown): maybeObservable is Observable<T> =>
  typeof maybeObservable === "object" && typeof (maybeObservable as Observable<T>).subscribe === "function";

function assertIsObservable<T>(maybeObservable: unknown): asserts maybeObservable is Observable<T> {
  if (!isObservable(maybeObservable)) this.error(`Expected an Observable, but got ${typeof maybeObservable}`);
}

export const useOnPostUpdated = ({ postId, onPostUpdated, onPostUpdatedError }: Props) => {
  useEffect(() => {
    const observable = API.graphql(graphqlOperation(OnPostUpdatedDocument, { id: postId }));
    assertIsObservable<{ value: { data: OnPostUpdatedSubscription } }>(observable);

    const subscription = observable.subscribe({
      next: ({ value }) => {
        onPostUpdated(value.data.onPostUpdated);
      },
      error: (err) => {
        if (onPostUpdatedError) onPostUpdatedError(err);
      },
    });

    return () => subscription.unsubscribe();
  }, [onPostUpdated, onPostUpdatedError, postId]);
};
