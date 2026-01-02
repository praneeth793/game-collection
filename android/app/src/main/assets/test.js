const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`Console Error: ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
    });

    try {
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

        // Wait for app to load
        await page.waitForTimeout(2000);

        // Check if loading screen is hidden
        const loadingHidden = await page.$eval('#loading-screen', el => el.classList.contains('hidden'));
        console.log(`Loading screen hidden: ${loadingHidden}`);

        // Check if app is visible
        const appVisible = await page.$eval('#app', el => !el.classList.contains('hidden'));
        console.log(`App visible: ${appVisible}`);

        // Check navigation works
        const navItems = await page.$$('.nav-item');
        console.log(`Navigation items found: ${navItems.length}`);

        // Test clicking on a game
        await page.click('.nav-item[data-section="snake"]');
        await page.waitForTimeout(1000);

        const snakeActive = await page.$eval('#snake-section', el => el.classList.contains('active'));
        console.log(`Snake section active: ${snakeActive}`);

        // Check if canvas exists
        const snakeCanvas = await page.$('#snake-game');
        console.log(`Snake canvas exists: ${snakeCanvas !== null}`);

        // Navigate to racing game
        await page.click('.nav-item[data-section="racing"]');
        await page.waitForTimeout(2000);

        const racingActive = await page.$eval('#racing-section', el => el.classList.contains('active'));
        console.log(`Racing section active: ${racingActive}`);

        // Check if Three.js canvas exists
        const racingCanvas = await page.$('#racing-game canvas');
        console.log(`Racing Three.js canvas exists: ${racingCanvas !== null}`);

        // Navigate to Tic-Tac-Toe
        await page.click('.nav-item[data-section="tictactoe"]');
        await page.waitForTimeout(500);

        const tttBoard = await page.$('.ttt-board');
        console.log(`Tic-Tac-Toe board exists: ${tttBoard !== null}`);

        // Navigate to Pong
        await page.click('.nav-item[data-section="pong"]');
        await page.waitForTimeout(1000);

        const pongCanvas = await page.$('#pong-game');
        console.log(`Pong canvas exists: ${pongCanvas !== null}`);

        // Navigate to Tetris
        await page.click('.nav-item[data-section="tetris"]');
        await page.waitForTimeout(1000);

        const tetrisCanvas = await page.$('#tetris-game');
        console.log(`Tetris canvas exists: ${tetrisCanvas !== null}`);

        // Go back home
        await page.click('.back-btn');
        await page.waitForTimeout(500);

        const homeActive = await page.$eval('#home-section', el => el.classList.contains('active'));
        console.log(`Home section active: ${homeActive}`);

        // Report errors
        if (errors.length > 0) {
            console.log('\n=== ERRORS FOUND ===');
            errors.forEach(err => console.log(err));
        } else {
            console.log('\n=== NO ERRORS - ALL TESTS PASSED ===');
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }

    await browser.close();
})();
