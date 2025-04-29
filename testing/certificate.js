const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const addContext = require('mochawesome/addContext');
require('dotenv').config();

const CERTIFICATE_NO = process.env.CERTIFICATE_NO || "DEFAULT_CERT_NO";
const CERTIFICATE_NAME = process.env.CERTIFICATE_NAME || "DEFAULT_CERT_NAME";

describe('Certificate Verification Tests', function () {
    let driver;

    this.timeout(100000);

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://training.qiteplanguage.org/certificate'); 
    });

    afterEach(async function () {
        if (driver) {
            try {
                const testTitle = this.currentTest.title.replace(/\s+/g, '_');
                const screenshotsDir = path.resolve(__dirname, '../mochawesome-report/screenshot/certificate');
                const screenshotPath = path.join(screenshotsDir, `${testTitle}.png`);

                fs.mkdirSync(screenshotsDir, { recursive: true });

                const screenshot = await driver.takeScreenshot();
                fs.writeFileSync(screenshotPath, screenshot, 'base64');

                addContext(this, {
                    title: 'Screenshot',
                    value: `../screenshots/${testTitle}.png`
                });
            } catch (err) {
                console.error('Error taking screenshot:', err.message);
            } finally {
                await driver.quit();
            }
        }
    });

    it('CERTTC001 - Valid Certificate and Name', async function () {
        await driver.findElement(By.name('no_sertifikat')).sendKeys(CERTIFICATE_NO);
        await driver.findElement(By.name('name_sertifikat')).sendKeys(CERTIFICATE_NAME);

        // Tunggu reCAPTCHA (otomatis solved di versi testing)
        await driver.wait(until.elementLocated(By.className('g-recaptcha')), 10000);
        await driver.sleep(2000); // untuk memastikan token ter-generate

        await driver.findElement(By.css('input[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('CERTTC002 - Invalid Certificate (Non-Numeric)', async function () {
        await driver.findElement(By.name('no_sertifikat')).sendKeys('23/I.A/VII/2024');
        await driver.findElement(By.name('name_sertifikat')).sendKeys(CERTIFICATE_NAME);
        await driver.sleep(2000);
        await driver.findElement(By.css('input[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('CERTTC003 - Submit without CAPTCHA (should still pass in test mode)', async function () {
        await driver.findElement(By.name('no_sertifikat')).sendKeys(CERTIFICATE_NO);
        await driver.findElement(By.name('name_sertifikat')).sendKeys(CERTIFICATE_NAME);
        await driver.sleep(2000);
        await driver.findElement(By.css('input[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('CERTTC004 - Leave Fields Empty', async function () {
        await driver.sleep(2000);
        await driver.findElement(By.css('input[type="submit"]')).click();
        await driver.sleep(3000);
    });
});
