Feature("LandingPage");

Scenario("open landing page", ({ I }) => {
  I.amOnPage("/");
});

Scenario("click What is inLive", ({ I }) => {
  I.amOnPage("/");
  I.click("What is inLive");
  I.see("WHAT IS INLIVE");
});

Scenario("click What We Offer", ({ I }) => {
  I.amOnPage("/");
  I.click("What We Offer");
  I.see("WHAT WE OFFER");
});

Scenario("click Why Us", ({ I }) => {
  I.amOnPage("/");
  I.click("Why Us");
  I.see("WHY US");
});

Scenario("click Pricing", ({ I }) => {
  I.amOnPage("/");
  I.click("Pricing");
  I.seeInCurrentUrl("/pricing");
});

Scenario("click Use Cases", ({ I }) => {
  I.amOnPage("/");
  I.click("Use Cases");
  I.see("USE CASES");
});

Scenario("click Docs", ({ I }) => {
  I.amOnPage("/");
  I.click("Docs");
  I.seeInCurrentUrl("/docs/introduction/");
});

Scenario("click Blog", ({ I }) => {
  I.amOnPage("/");
  I.click("Blog");
  I.seeInCurrentUrl("/blog");
});