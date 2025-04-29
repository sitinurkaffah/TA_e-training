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
                const screenshotsDir = path.resolve(__dirname, '../mochawesome-report/screenshot/register');
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

    it('REGISTERTC001 - Valid Data', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

        // Account
        await driver.findElement(By.name("email_peserta")).sendKeys("testingeva01@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("repassword")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("tlp_peserta")).sendKeys("088851531512");

        await driver.findElement(By.id("agrement")).click();
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

        // Pilih Negara
        const negaraSelect = new Select(await driver.findElement(By.name("kode_negara")));
        await negaraSelect.selectByValue("ID"); // Indonesia

        // Pilih Provinsi
        const provinsiDropdown = await driver.wait(async () => {
        const options = await driver.executeScript(
            "return Array.from(document.querySelectorAll('select[name=\"id_provinsi\"] option')).map(o => o.textContent);"
        );
        console.log("Daftar Opsi Provinsi:", options);
        return options.length > 1; 
        }, 10000);

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

        // Klik tombol Next Step
        const nextStep = await driver.findElement(By.xpath("(//a[@name='next'])[2]")); 
        await driver.executeScript("arguments[0].scrollIntoView(true);", nextStep); 
        await nextStep.click();

        // Institution
        await driver.findElement(By.name("nama_institusi_peserta")).sendKeys("STT Nurul Fikri");
        await driver.findElement(By.name("status_institusi_peserta")).sendKeys("Government");

        // Klik tombol Next Step setelah institusi (step ke-3)
        const allNextButtons = await driver.findElements(By.xpath("//a[@name='next' and contains(@class, 'next')]"));
        const step3Button = allNextButtons[2]; 
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", step3Button);
        await driver.executeScript("arguments[0].click();", step3Button);

       // Klik checkbox persetujuan
        const agreementCheckbox = await driver.findElement(By.id("agrement2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", agreementCheckbox);
        await agreementCheckbox.click();
        await driver.wait(async () => {
            const btnRegister = await driver.findElement(By.id("btnSave2"));
            const isDisabled = await btnRegister.getAttribute("disabled");
            return isDisabled === null;
        }, 5000);

        // Klik tombol Register
        const btnRegister = await driver.findElement(By.id("btnSave2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnRegister);
        await btnRegister.click();
    });

    it('REGISTERTC002 - Empty Fields', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

        const btnSave1 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
            await driver.wait(until.elementIsVisible(btnSave1), 7000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave1);
            await btnSave1.click();
            await driver.sleep(5000);
    });

    it('REGISTERTC003 - Weak Password', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

         // Account
        await driver.findElement(By.name("email_peserta")).sendKeys("seleniumeva@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("tesselenium123");
        await driver.findElement(By.name("repassword")).sendKeys("tesselenium123");
        await driver.findElement(By.name("tlp_peserta")).sendKeys("081931531497");
        await driver.findElement(By.id("agrement")).click();

        // Klik tombol Next Step
        const btnSave1 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
        await driver.wait(until.elementIsVisible(btnSave1), 7000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave1);
        await btnSave1.click();
        await driver.sleep(7000);
    });

    it('REGISTERTC004 - Email Already Used', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

        //Account
        await driver.findElement(By.name("email_peserta")).sendKeys("peoplepeople953@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("repassword")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("tlp_peserta")).sendKeys("085781531494");
        await driver.findElement(By.id("agrement")).click();

        // Klik tombol Next Step
        const btnSave1 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
        await driver.wait(until.elementIsVisible(btnSave1), 7000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave1);
        await btnSave1.click();

        await driver.sleep(7000);
    });

    it('REGISTERTC005 - Same Name', async function () {
        await driver.get("https://training.qiteplanguage.org/register");

         // Account
        await driver.findElement(By.name("email_peserta")).sendKeys("testingselenium02@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("repassword")).sendKeys("Tesselenium123_");
        await driver.findElement(By.name("tlp_peserta")).sendKeys("083537831234");
        await driver.findElement(By.id("agrement")).click();

        // Klik tombol Next Step
        const btnSave1 = await driver.wait(until.elementLocated(By.id("btnSave")), 10000);
        await driver.wait(until.elementIsVisible(btnSave1), 7000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnSave1);
        await btnSave1.click();
        await driver.sleep(7000);

        //Personal Data
        const namaInput = await driver.wait(until.elementLocated(By.name("nama_peserta")), 10000);
        await driver.wait(until.elementIsVisible(namaInput), 5000);
        await namaInput.sendKeys("Tes Selenium Eva");
        const genderSelect = new Select(await driver.findElement(By.name("jenis_kelamin_peserta")));
        await genderSelect.selectByValue("2"); // Female
        await driver.findElement(By.name("tanggal_lahir_peserta")).sendKeys("2000");
        const profesiSelect = new Select(await driver.findElement(By.name("id_profesi")));
        await profesiSelect.selectByValue("3"); // College Student
        const bahasaSelect = new Select(await driver.findElement(By.name("id_bahasa")));
        await bahasaSelect.selectByValue("6"); // Indonesian
        await driver.findElement(By.name("alamat_peserta")).sendKeys("Jalan Pepaya No.3A");

        // Pilih Negara
        const negaraSelect = new Select(await driver.findElement(By.name("kode_negara")));
        await negaraSelect.selectByValue("ID"); // Indonesia

        // Pilih Provinsi
        const provinsiDropdown = await driver.wait(async () => {
        const options = await driver.executeScript(
            "return Array.from(document.querySelectorAll('select[name=\"id_provinsi\"] option')).map(o => o.textContent);"
        );
        console.log("Daftar Opsi Provinsi:", options);
        return options.length > 1; 
        }, 10000);

        const provinsiSelect = new Select(await driver.findElement(By.name("id_provinsi")));
        await provinsiSelect.selectByVisibleText("Jakarta");

        // Pilih Kota
        const kotaDropdown = await driver.wait(async () => {
        const options = await driver.executeScript(
            "return Array.from(document.querySelectorAll('select[name=\"id_kota\"] option')).map(o => o.textContent);"
        );
        console.log("Daftar Opsi Kota:", options);
        return options.length > 1; 
        }, 10000);

        const kotaSelect = new Select(await driver.findElement(By.name("id_kota")));
        await kotaSelect.selectByVisibleText("Kota Administrasi Jakarta Selatan");

        // Klik tombol Next Step
        const nextStep = await driver.findElement(By.xpath("(//a[@name='next'])[2]")); 
        await driver.executeScript("arguments[0].scrollIntoView(true);", nextStep); 
        await nextStep.click();

        // Institution
        await driver.findElement(By.name("nama_institusi_peserta")).sendKeys("STT Nurul Fikri");
        await driver.findElement(By.name("status_institusi_peserta")).sendKeys("Government");

        // Klik tombol Next Step setelah institusi (step ke-3)
        const allNextButtons = await driver.findElements(By.xpath("//a[@name='next' and contains(@class, 'next')]"));
        const step3Button = allNextButtons[2]; 
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", step3Button);
        await driver.executeScript("arguments[0].click();", step3Button);

       // Klik checkbox persetujuan
        const agreementCheckbox = await driver.findElement(By.id("agrement2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", agreementCheckbox);
        await agreementCheckbox.click();
        await driver.wait(async () => {
            const btnRegister = await driver.findElement(By.id("btnSave2"));
            const isDisabled = await btnRegister.getAttribute("disabled");
            return isDisabled === null;
        }, 5000);

        // Klik tombol Register
        const btnRegister = await driver.findElement(By.id("btnSave2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnRegister);
        await btnRegister.click();
    });
});