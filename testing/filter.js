const fs = require('fs');
const path = require('path');
const { Builder, By } = require('selenium-webdriver');
const addContext = require('mochawesome/addContext');

describe('eTraining Filter Tests', function () {
    let driver;

    this.timeout(100000);

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://training.qiteplanguage.org/course');
    });

    afterEach(async function () {
        if (driver) {
            try {
                const testTitle = this.currentTest.title.replace(/\s+/g, '_');
                const screenshotsDir = path.resolve(__dirname, '../mochawesome-report/screenshot/filter');
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

    it('FILTERTC001 - Leave all fields empty and click search', async function () {
        const searchButton = await driver.findElement(By.css('button[type="submit"]'));
        await searchButton.click();
        await driver.sleep(3000);
    });

    it('FILTERTC002 - Fill in title only', async function () {
        const titleInput = await driver.findElement(By.name('pencarian'));
        await titleInput.sendKeys('Pelatihan');
        const searchButton = await driver.findElement(By.css('button[type="submit"]'));
        await searchButton.click();
        await driver.sleep(3000);
    });

    it('FILTERTC003 - Filter by year and course type', async function () {
        await driver.findElement(By.name('year')).sendKeys('2023');
        await driver.findElement(By.name('kegiatan')).sendKeys('Mentorship');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('FILTERTC004 - Filter by month and course type', async function () {
        await driver.findElement(By.name('month')).sendKeys('September');
        await driver.findElement(By.name('kegiatan')).sendKeys('Workshop');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('FILTERTC005 - Fill in all fields', async function () {
        await driver.findElement(By.name('pencarian')).sendKeys('Lokakarya');
        await driver.findElement(By.name('month')).sendKeys('September');
        await driver.findElement(By.name('year')).sendKeys('2024');
        await driver.findElement(By.name('kegiatan')).sendKeys('Workshop');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    });

    it('FILTERTC006 - Use special characters in title', async function () {
        await driver.findElement(By.name('pencarian')).sendKeys('Lokakarya#!');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    });
});