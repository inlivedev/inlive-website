Feature('documentation page');

Scenario("click Docs", ({ I }) => {
    I.amOnPage("/");
    I.click("Docs");
    I.seeInCurrentUrl("/docs/introduction/");
});
