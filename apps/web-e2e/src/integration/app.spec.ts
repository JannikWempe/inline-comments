import { handlers } from "api-mock/handlers";
import {
  POST_WITH_EXISTING_AND_NEW_COMMENT,
  POST_WITH_EXISTING_COMMENT,
  POST_WITH_EXISTING_COMMENT_AND_NEW_RESPONSE,
  POST_WITHOUT_COMMENT,
} from "api-mock/data/post";
import { EXISTING_COMMENT, NEW_COMMENT } from "api-mock/data/comment";
import { NEW_COMMENT_RESPONSE } from "api-mock/data/comment-response";

beforeEach(() => {
  cy.waitForNetworkIdlePrepare({
    method: "POST",
    pattern: "*",
    alias: "calls",
  });
  cy.visit(`/${POST_WITH_EXISTING_COMMENT.id}`);
  cy.window().then((window) => {
    const { worker } = window.msw;
    worker.use(...handlers);
  });

  cy.findByText("review");
  cy.findByText(/1 comments?/i);
});

it("should add a new comment", () => {
  // init adding new comment
  cy.findByTestId("annotator-content")
    .trigger("mousedown")
    .then(($el) => {
      const el = $el[0];
      const document = el.ownerDocument;
      const range = document.createRange();
      range.selectNodeContents(el);
      // offset are number of dom nodes
      range.setStart(el, 1);
      range.setEnd(el, 3);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);
    })
    .trigger("mouseup");
  cy.findByRole("button", { name: /add comment/gi }).click();
  cy.get(`mark[data-new-comment="true"]`).should("exist");

  // add new comment
  cy.findByText(/adding a new comment/i);
  cy.findByLabelText("Comment").type(NEW_COMMENT.content);
  cy.waitForNetworkIdle("@calls", 1000);
  cy.window().then((window) => {
    const { worker, graphql } = window.msw;
    worker.use(
      graphql.query("Post", (req, res, ctx) => {
        return res(
          ctx.data({
            getPostById: POST_WITH_EXISTING_AND_NEW_COMMENT,
          })
        );
      })
    );
    cy.findByRole("button", { name: /save/gi }).click();

    // now there are 2 comments
    cy.findByText(/2 comments/i);
    cy.findAllByTestId("comment")
      .first()
      .within(() => {
        cy.findByText(NEW_COMMENT.author.username);
        cy.findByText(NEW_COMMENT.content);
      });
    // new comment marker is replaced with actual comment marker
    cy.get(`mark[data-new-comment="true"]`).should("not.exist");
    cy.get(`mark[data-comment-id="${NEW_COMMENT.id}"]`).should("exist");
  });
});

it("should delete a comment", () => {
  // delete comment
  cy.waitForNetworkIdle("@calls", 1000);
  cy.window().then((window) => {
    const { worker, graphql } = window.msw;
    worker.use(
      graphql.query("Post", (req, res, ctx) => {
        return res(
          ctx.data({
            getPostById: POST_WITHOUT_COMMENT,
          })
        );
      })
    );
  });
  cy.findByRole("button", { name: /delete comment/gi }).click();

  // no comment & marker left
  cy.findByText(/0 comments/i);
  cy.findByTestId("comment").should("not.exist");
  cy.findByText(EXISTING_COMMENT.content).should("not.exist");
  cy.get(`mark[data-comment-id]`).should("not.exist");
});

it("should add responses", () => {
  // starting with 1 response
  cy.findByRole("button", { name: /show 1 responses?/i }).click();
  cy.findAllByTestId("comment-response").should("have.length", 1);
  cy.findByText(EXISTING_COMMENT.responses[0].content);

  // add new response
  cy.findByRole("button", { name: /add response/i }).click();
  cy.findByLabelText(/response/i).type(NEW_COMMENT_RESPONSE.content);
  cy.waitForNetworkIdle("@calls", 1000);
  cy.window().then((window) => {
    const { worker, graphql } = window.msw;
    worker.use(
      graphql.query("Post", (req, res, ctx) => {
        return res(
          ctx.data({
            getPostById: POST_WITH_EXISTING_COMMENT_AND_NEW_RESPONSE,
          })
        );
      })
    );
  });
  cy.findByRole("button", { name: /send/i }).click();

  // new response shown
  cy.findAllByTestId("comment-response").should("have.length", 2);
  cy.findByText(NEW_COMMENT_RESPONSE.content);

  // cancel hides new response form
  cy.findByRole("button", { name: /cancel/i }).click();
  cy.findByLabelText(/response/i).should("not.exist");

  // hide responses
  cy.findByRole("button", { name: /hide responses/i }).click();
  cy.findAllByTestId("comment-response").should("have.length", 0);
  cy.findByRole("button", { name: /show 2 responses/i });
});

it("should animate comment when hovering the comment marker", () => {
  cy.findByTestId("comment")
    .invoke("attr", "class")
    .should("not.match", /scale-10[^0]/g);
  cy.get(`mark[data-comment-id="${EXISTING_COMMENT.id}"]`).click(); // .trigger("mouseover") not working
  cy.findByTestId("comment")
    .invoke("attr", "class")
    .should("match", /scale-10[^0]/g);
});

it("should change marker when hovering comment", () => {
  cy.get(`mark[data-comment-id="${EXISTING_COMMENT.id}"]`)
    .invoke("attr", "class")
    .should("not.match", /bg-red-500\/50/g);
  cy.findByTestId("comment").trigger("mouseover");
  cy.get(`mark[data-comment-id="${EXISTING_COMMENT.id}"]`)
    .invoke("attr", "class")
    .should("match", /bg-red-500\/50/g);
});
