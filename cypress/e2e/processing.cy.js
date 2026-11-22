/* global describe, it, cy */

describe("Video processing", () => {
  it("shows the CSV link when processing finishes", () => {
    cy.intercept("GET", "/thumbnail/sample.mp4", {
      statusCode: 404,
    });

    cy.intercept(
      {
        method: "POST",
        pathname: "/process/sample.mp4",
        query: { targetColor: "ffa200", threshold: "164" },
      },
      {
        statusCode: 202,
        body: { jobId: "test-job" },
      }
    ).as("startJob");

    let checks = 0;

    cy.intercept("GET", "/process/test-job/status", (request) => {
      checks++;

      request.reply({
        body:
          checks === 1
            ? { status: "processing" }
            : { status: "done", result: "/results/test-job.csv" },
      });
    }).as("jobStatus");

    cy.visit("http://localhost:5173/preview/sample.mp4");

    cy.contains("button", "Process Video with These Settings").click();
    cy.wait("@startJob");
    cy.wait("@jobStatus");

    cy.contains("button", "Process Video with These Settings").should(
      "be.disabled"
    );

    cy.wait("@jobStatus");

    cy.contains("a", "Download CSV")
      .should("be.visible")
      .and("have.attr", "href", "/results/test-job.csv");
  });
});
