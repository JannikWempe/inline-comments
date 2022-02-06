import { assignNewCommentId } from "./addComment";

it.each([
  [`Bla bla <mark data-new-comment="true">with</mark> some stuff.`],
  [`Bla bla <mark data-new-comment="true">with</mark> some stuff.`],
  [`Bla bla <mark data-new-comment="true" class="Hi">with</mark> some stuff.`],
])("should assign comment id given a new comment", (content) => {
  const result = assignNewCommentId(content, "123");

  expect(result).toBe(`Bla bla <mark data-comment-id="123">with</mark> some stuff.`);
});

it("should not replace across multiple marks", () => {
  const result = assignNewCommentId(
    `<mark data-comment-id="435">Bla</mark> bla <mark data-new-comment="true">with</mark> some <mark data-comment-id="785">stuff</mark>.`,
    "123"
  );

  expect(result).toBe(
    `<mark data-comment-id="435">Bla</mark> bla <mark data-comment-id="123">with</mark> some <mark data-comment-id="785">stuff</mark>.`
  );
});

it.each([
  [`Bla <mark data-new-comment="false">with</mark> some.`],
  [`Bla <mark data-comment-id="123">with</mark> some.`],
  [`Bla <mark>with</mark> some.`],
  [`Bla <mark class="hi">with</mark> some.`],
  [`Bla some.`],
  [`Bla <b data-new-comment="true">some</b>.`],
])("should throw given no new comment", (content) => {
  expect(() => assignNewCommentId(content, "123")).toThrow();
});

it("should throw given multiple new comments", () => {
  expect(() =>
    assignNewCommentId(
      `Bla <mark data-new-comment="true">with</mark> some. <mark data-new-comment="true">with</mark> some.`,
      "123"
    )
  ).toThrow();
});
