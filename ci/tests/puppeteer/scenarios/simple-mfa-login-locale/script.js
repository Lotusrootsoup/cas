const puppeteer = require("puppeteer");
const assert = require("assert");
const cas = require("../../cas.js");

(async () => {
    await cas.refreshContext();

    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await cas.newPage(browser);
    await cas.gotoLoginWithAuthnMethod(page, undefined, "mfa-simple", "de");
    await cas.loginWith(page);
    await cas.waitForTimeout(page, 1000);
    await cas.assertVisibility(page, "#token");

    const page2 = await browser.newPage();
    await page2.goto("http://localhost:8282");
    await page2.waitForTimeout(1000);
    await cas.click(page2, "table tbody td a");
    await page2.waitForTimeout(1000);
    let code = await cas.textContent(page2, "div[name=bodyPlainText] .well");
    assert(code.includes("Dear CAS Apereo,Here is your token->"));
    code = code.substring(code.lastIndexOf(">") + 1);
    await cas.log(`Code to use is extracted as ${code}`);
    await page2.close();

    await page.bringToFront();
    await cas.type(page, "#token", code);
    await cas.submitForm(page, "#fm1");
    await cas.waitForTimeout(page, 1000);
    await cas.submitForm(page, "#registerform");
    await cas.waitForTimeout(page, 1000);
    await cas.assertInnerText(page, "#content div h2", "Anmeldung erfolgreich");
    await cas.assertCookie(page);

    await browser.close();
})();
