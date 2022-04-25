Feature('pricing page');

Scenario("click Pricing", ({ I }) => {
    I.amOnPage("/");
    I.click("Pricing");
    I.seeInCurrentUrl("/pricing");
    I.see("Choose Your Plan");
    I.see("Frequently Asked Questions");
});