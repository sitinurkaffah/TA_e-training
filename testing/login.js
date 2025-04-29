require('dotenv').config();
const { By, Builder, Key } = require('selenium-webdriver');
const addContext = require("mochawesome/addContext");
const fs = require('fs');
const path = require('path');

describe('eTraining Login Tests', function () {
    let driver;
    this.timeout(80000);

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://training.qiteplanguage.org/signin');
    });
    
    async function fillLoginForm(email, password) {
        const emailField = await driver.findElement(By.css('input[name="email_peserta"]'));
        const passwordField = await driver.findElement(By.css('input[name="password"]'));
        
        await emailField.clear();
        await passwordField.clear();
        
        await emailField.sendKeys(email);
        await passwordField.sendKeys(password);
    }
    
    async function clickLoginButton() {
        const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
        await loginBtn.click();
    }

    afterEach(async function () {
        if (driver) {
            const screenshotsDir = '../mochawesome-report/screenshot/login';
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const testTitle = this.currentTest.title.replace(/\s+/g, '_');
            const screenshotPath = path.join(screenshotsDir, `${testTitle}.png`);
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync(screenshotPath, screenshot, 'base64');

            addContext(this, {
                title: 'Screenshot',
                value: `../screenshot/login/${testTitle}.png`
            });

            await driver.sleep(3000);
            await driver.quit();
        }
    });

    it('LOGINTC001 - Successful Login', async function () {
        await fillLoginForm(process.env.EMAIL, process.env.PASSWORD);
        await clickLoginButton();
        await driver.sleep(3000);
    });

    it('LOGINTC002 - Registered Email but Incorrect Password', async function () {
        await fillLoginForm(process.env.EMAIL, 'Tesselenium123');
        await clickLoginButton();
        await driver.sleep(3000);
    });

    it('LOGINTC003 - Invalid Email Format', async function () {
        await fillLoginForm('seleniumtes123@gmaillll.com', process.env.PASSWORD);
        await clickLoginButton();
        await driver.sleep(3000);
    });

    it('LOGINTC004 - Empty Email and Password Fields', async function () {
        await fillLoginForm('', '');
        await clickLoginButton();
        await driver.sleep(3000);
    });

    it('LOGINTC005 - Submit Login Form with Enter Key', async function () {
        await driver.findElement(By.name('email_peserta')).sendKeys(process.env.EMAIL);
        await driver.findElement(By.name('password')).sendKeys(process.env.PASSWORD, Key.RETURN);
        await driver.sleep(3000);
    });    

});
