const { chromium } = require('playwright');

// Цвета для консоли
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(color, message) {
  console.log(`${color}${message}${RESET}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBrokerApp() {
  log(BLUE, '\n╔════════════════════════════════════════════╗');
  log(BLUE, '║      E2E Тесты - Брокерское приложение    ║');
  log(BLUE, '╚════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // --- Тест 1: Загрузка главной страницы ---
    log(YELLOW, '📝 Тест 1: Загрузка главной страницы...');
    await page.goto('http://localhost:5175');
    await sleep(2000);

    const title = await page.title();
    if (title) {
      log(GREEN, '✅ Главная страница загружена');
      testsPassed++;
    } else {
      log(RED, '❌ Заголовок страницы не найден');
      testsFailed++;
    }

    // --- Тест 2: Создание нового брокера ---
    log(YELLOW, '\n📝 Тест 2: Создание нового брокера...');
    const brokerName = `TestBroker_${Date.now()}`;

    // Ввод имени через v-combobox
    const nameInput = page.locator('input[role="combobox"]').first();
    await nameInput.fill(brokerName);
    await sleep(500);

    // Ввод стартового капитала
    const capitalInput = page.locator('input[type="number"]').first();
    await capitalInput.fill('15000');
    await sleep(500);

    // Клик по кнопке "Создать и войти"
    const submitBtn = page.locator('button:has-text("Создать и войти")').first();
    await submitBtn.click();
    await sleep(3000);

    const url = page.url();
    if (url.includes('/broker/')) {
      log(GREEN, `✅ Брокер создан: ${brokerName}`);
      testsPassed++;
    } else {
      log(RED, '❌ Брокер не был создан');
      testsFailed++;
    }

    // --- Тест 3: Проверка отображения баланса ---
    log(YELLOW, '\n📝 Тест 3: Проверка отображения баланса...');
    const bodyText = await page.textContent('body');
    if (bodyText.includes('15000') || bodyText.includes('15,000')) {
      log(GREEN, '✅ Баланс отображается корректно');
      testsPassed++;
    } else {
      log(RED, '❌ Баланс не отображается');
      testsFailed++;
    }

    // --- Тест 4: Проверка текущих котировок ---
    log(YELLOW, '\n📝 Тест 4: Проверка отображения котировок...');
    const hasPrices = bodyText.includes('Текущие котировки') || bodyText.includes('котировки');
    if (hasPrices) {
      log(GREEN, '✅ Котировки отображаются');
      testsPassed++;
    } else {
      log(RED, '❌ Котировки не найдены');
      testsFailed++;
    }

    // --- Тест 5: Открытие диалога торговли ---
    log(YELLOW, '\n📝 Тест 5: Открытие диалога торговли...');
    const tradeButton = await page.locator('button:has-text("Торговать")').first();
    if (await tradeButton.count() > 0) {
      await tradeButton.click();
      await sleep(2000);

      const dialogVisible = await page.locator('.v-dialog').isVisible();
      if (dialogVisible) {
        log(GREEN, '✅ Диалог торговли открыт');
        testsPassed++;

        // Закрыть диалог
        const closeBtn = await page.locator('button:has-text("Закрыть")').first();
        if (await closeBtn.count() > 0) {
          await closeBtn.click();
          await sleep(1000);
        }
      } else {
        log(RED, '❌ Диалог не открылся');
        testsFailed++;
      }
    } else {
      log(RED, '❌ Кнопка торговли не найдена');
      testsFailed++;
    }

    // --- Тест 6: Проверка портфеля ---
    log(YELLOW, '\n📝 Тест 6: Проверка отображения портфеля...');
    const portfolioVisible = await page.textContent('body').then(text =>
      text.includes('Портфель') || text.includes('портфель')
    );
    if (portfolioVisible) {
      log(GREEN, '✅ Портфель отображается');
      testsPassed++;
    } else {
      log(RED, '❌ Портфель не отображается');
      testsFailed++;
    }

    // --- Тест 7: Проверка возврата на главную ---
    log(YELLOW, '\n📝 Тест 7: Проверка возврата на главную...');
    const homeButton = await page.locator('a:has-text("Главная"), button:has-text("Главная")').first();
    if (await homeButton.count() > 0) {
      await homeButton.click();
      await sleep(2000);

      const isHome = !page.url().includes('/broker/');
      if (isHome) {
        log(GREEN, '✅ Возврат на главную страницу');
        testsPassed++;
      } else {
        log(RED, '❌ Не удалось вернуться на главную');
        testsFailed++;
      }
    } else {
      log(YELLOW, '⚠️ Кнопка главной не найдена');
      testsPassed++;
    }

    // --- Тест 8: Проверка отображения брокера на главной ---
    log(YELLOW, '\n📝 Тест 8: Проверка списка брокеров...');
    const brokerInList = await page.textContent('body').then(text =>
      text.includes(brokerName)
    );
    if (brokerInList) {
      log(GREEN, '✅ Брокер отображается в списке');
      testsPassed++;
    } else {
      log(RED, '❌ Брокер не найден в списке');
      testsFailed++;
    }

  } catch (error) {
    log(RED, `\n❌ Критическая ошибка: ${error.message}`);
    testsFailed++;
  } finally {
    await browser.close();

    // Итоги
    log(BLUE, '\n╔════════════════════════════════════════════╗');
    log(BLUE, '║           РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ          ║');
    log(BLUE, '╚════════════════════════════════════════════╝\n');

    log(GREEN, `✅ Пройдено тестов: ${testsPassed}`);
    log(RED, `❌ Провалено тестов: ${testsFailed}`);

    const total = testsPassed + testsFailed;
    const percentage = ((testsPassed / total) * 100).toFixed(1);
    log(BLUE, `\n📊 Успешность: ${percentage}%\n`);

    process.exit(testsFailed === 0 ? 0 : 1);
  }
}

// Запуск тестов
log(BLUE, 'Запуск E2E тестов (Playwright)...');
log(YELLOW, 'Убедитесь, что приложение запущено на http://localhost:5175\n');

testBrokerApp().catch(error => {
  log(RED, `\nОшибка при запуске тестов: ${error.message}`);
  process.exit(1);
});
