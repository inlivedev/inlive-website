Feature('blog page');

Scenario("click Blog", ({ I }) => {
    I.amOnPage("/");
    I.click("Blog");
    I.seeInCurrentUrl("/blog");
});