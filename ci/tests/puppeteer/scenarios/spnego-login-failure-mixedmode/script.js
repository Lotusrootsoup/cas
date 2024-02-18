const puppeteer = require("puppeteer");
const cas = require("../../cas.js");

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await cas.newPage(browser);

    await page.setExtraHTTPHeaders({
        "Authorization": "Negotiate unknown-token"
    });
    await cas.gotoLogin(page);
    
    await cas.loginWith(page);
    await cas.waitForTimeout(page, 3000);

    await cas.assertInnerText(page, "#content div h2", "Log In Successful");

    await browser.close();
})();
