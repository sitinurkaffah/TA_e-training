const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const addContext = require('mochawesome/addContext');
const { Select } = require('selenium-webdriver/lib/select');

describe('eTraining Register Tests', function () {
    let driver;
    this.timeout(80000);

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function () {
        if (driver) {
            try {
                const screenshotsDir = path.resolve(__dirname, '../myReport/screenshots/register');
                fs.mkdirSync(screenshotsDir, { recursive: true });

                const testTitle = this.currentTest.title.replace(/\s+/g, '_');
                const screenshotPath = path.join(screenshotsDir, `${testTitle}.png`);

                const screenshot = await driver.takeScreenshot();
                fs.writeFileSync(screenshotPath, screenshot, 'base64');

                addContext(this, {
                    title: 'Screenshot',
                    value: `../screenshots/register/${testTitle}.png`
                });

                await driver.sleep(500);
            } catch (err) {
                console.error('Error taking screenshot:', err.message);
            } finally {
                await driver.quit();
            }
        }
    });

    it('TC1 - Valid Data', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

        // Account
        await driver.findElement(By.name("email_peserta")).sendKeys("peoplepeople953@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("repassword")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("tlp_peserta")).sendKeys("081931531495");

        // Checklist persetujuan
        await driver.findElement(By.id("agrement")).click();

        // Tunggu sebentar untuk pastikan tombol aktif
        await driver.sleep(500);

        // Klik tombol Next Step
        const btnSave1 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
        await driver.wait(until.elementIsVisible(btnSave1), 7000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave1);
        await btnSave1.click();
    
        // Personal Step
        const namaInput = await driver.wait(until.elementLocated(By.name("nama_peserta")), 10000);
        await driver.wait(until.elementIsVisible(namaInput), 5000);
        await namaInput.sendKeys("Tes Selenium Eva");
        const genderSelect = new Select(await driver.findElement(By.name("jenis_kelamin_peserta")));
        await genderSelect.selectByValue("2"); // Female
        await driver.findElement(By.name("tanggal_lahir_peserta")).sendKeys("1999");
        const profesiSelect = new Select(await driver.findElement(By.name("id_profesi")));
        await profesiSelect.selectByValue("3"); // College Student
        const bahasaSelect = new Select(await driver.findElement(By.name("id_bahasa")));
        await bahasaSelect.selectByValue("6"); // Indonesian
        await driver.findElement(By.name("alamat_peserta")).sendKeys("Jalan Belimbing No.55");
        // await driver.findElement(By.css('select[name="kode_negara"] option[value="ID"]')).click(); // Indonesia

        // Pilih Negara
        const negaraSelect = new Select(await driver.findElement(By.name("kode_negara")));
        await negaraSelect.selectByValue("ID"); // Indonesia

        // Pilih Provinsi
        // const provinsiDropdown = await driver.wait(async () => {
        // const options = await driver.executeScript(
        //     "return Array.from(document.querySelectorAll('select[name=\"id_provinsi\"] option')).map(o => o.textContent);"
        // );
        // console.log("Daftar Opsi Provinsi:", options);
        // return options.length > 1; // Tunggu hingga opsi tersedia
        // }, 10000);

        const provinsiSelect = new Select(await driver.findElement(By.name("id_provinsi")));
        await provinsiSelect.selectByVisibleText("West Java");

        // Pilih Kota
        const kotaDropdown = await driver.wait(async () => {
        const options = await driver.executeScript(
            "return Array.from(document.querySelectorAll('select[name=\"id_kota\"] option')).map(o => o.textContent);"
        );
        console.log("Daftar Opsi Kota:", options);
        return options.length > 1; 
        }, 10000);

        const kotaSelect = new Select(await driver.findElement(By.name("id_kota")));
        await kotaSelect.selectByVisibleText("Depok");

        await driver.sleep(1000); 

        // Klik tombol Next Step
        const next = await driver.wait(until.elementLocated(By.name("next")), 10000);
        await driver.wait(until.elementIsVisible(next), 50000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", next);
        await next.click();


        // Institution
        await driver.findElement(By.name("nama_institusi_peserta")).sendKeys("STT Nurul Fikri");
        await driver.findElement(By.name("institution_status")).sendKeys("Government");

        // Klik tombol Next Step
        const btnSave3 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
        await driver.wait(until.elementIsVisible(btnSave3), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave3);
        await btnSave3.click();

        // Agreement
        await driver.findElement(By.name("agree")).click();
        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(3000);
    });
});

//     it('TC2 - Empty Fields', async function () {
//         await driver.get("https://training.qiteplanguage.org/register");
//         await driver.findElement(By.css("button[type='submit']")).click();
//         await driver.sleep(3000);
//     });

//     it('TC3 - Weak Password', async function () {
//         await driver.get("https://training.qiteplanguage.org/register");
//         await driver.findElement(By.name("email")).sendKeys("tesseleniumeva@gmail.com");
//         await driver.findElement(By.name("password")).sendKeys("abcdefg");
//         await driver.findElement(By.name("password_confirmation")).sendKeys("abcdefg");
//         await driver.findElement(By.name("phone")).sendKeys("088809995724");
//         await driver.findElement(By.css("button[type='submit']")).click();
//         await driver.sleep(3000);
//     });

//     it('TC4 - Email Already Used', async function () {
//         await driver.get("https://training.qiteplanguage.org/register");
//         await driver.findElement(By.name("email")).sendKeys("peoplepeople953@gmail.com");
//         await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
//         await driver.findElement(By.name("password_confirmation")).sendKeys("Tesselenium123_");
//         await driver.findElement(By.name("phone")).sendKeys("088809995724");
//         await driver.findElement(By.css("button[type='submit']")).click();
//         await driver.sleep(3000);
//     });

//     it('TC5 - Same Name', async function () {
//         await driver.get("https://training.qiteplanguage.org/register");

//         await driver.findElement(By.name("email")).sendKeys("tesseleniumeva@gmail.com");
//         await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
//         await driver.findElement(By.name("password_confirmation")).sendKeys("Tesselenium123_");
//         await driver.findElement(By.name("phone")).sendKeys("088809995724");

//         await driver.findElement(By.name("name")).sendKeys("Eva");
//         await driver.findElement(By.css("input[value='female']")).click();
//         await driver.findElement(By.name("year_of_birth")).sendKeys("2003");
//         await driver.findElement(By.name("profession")).sendKeys("college student");
//         await driver.findElement(By.name("language_specialization")).sendKeys("indonesian");
//         await driver.findElement(By.name("home_address")).sendKeys("Jalan Karet Kp.Gedong No.64");
//         await driver.findElement(By.name("country")).sendKeys("Indonesia");
//         await driver.findElement(By.name("province")).sendKeys("West Java");
//         await driver.findElement(By.name("city")).sendKeys("Kota Depok");

//         await driver.findElement(By.name("institution_name")).sendKeys("STT Nurul Fikri");
//         await driver.findElement(By.name("institution_status")).sendKeys("Government");

//         await driver.findElement(By.name("agree")).click();
//         await driver.findElement(By.css("button[type='submit']")).click();
//         await driver.sleep(3000);
//     });
// });
