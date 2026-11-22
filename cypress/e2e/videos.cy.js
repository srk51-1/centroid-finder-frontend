/* global describe, it, cy */

describe("Video chooser", () => {
  it("opens the preview when a video is selected", () => {
    cy.intercept("GET", "/api/videos", {
      body: ["sample.mp4"],
    }).as("videos");

    cy.visit("http://localhost:5173/videos");
    cy.wait("@videos");

    cy.contains("h1", "Choose a Video").should("be.visible");
    cy.contains("a", "sample.mp4").click();

    cy.location("pathname").should("eq", "/preview/sample.mp4");
    cy.contains("h1", "Video Preview").should("be.visible");
  });
});