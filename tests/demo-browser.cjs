'use strict';
// Run on a workstation with Playwright + Chromium. Not executed successfully in the managed session.
const {chromium}=require('playwright');const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const target=process.env.TANJE_TEST_URL||'file://'+path.resolve('dist/index.html');await page.goto(target);
 fs.mkdirSync('docs/screenshots',{recursive:true});await page.screenshot({path:'docs/screenshots/after-dashboard.png',fullPage:true});
 for(const v of ['overview','inventory','distribution','menu','cash','audit','waste','report','presentation']){await page.locator(`[data-act="go:${v}"]`).first().click();assert.ok(await page.locator('#page').innerText());}
 for(const type of ['receive','move','moveCsv','sale','saleCsv','count','waste','material','recipe','purchase']){await page.evaluate(t=>openForm(t),type);assert.equal(await page.locator('#dialog').isVisible(),true);await page.locator('#entry [data-act="close"]').first().click();}
 await page.locator('[data-act="go:cash"]').first().click();await page.locator('[data-act="new:sale"]').click();await page.locator('input[name="qty"]').fill('2');await page.locator('input[name="ref"]').fill('BROWSER-QA-1');await page.locator('#entry [type="submit"]').click();assert.equal(await page.locator('#dialog').isVisible(),false);
 await page.locator('[data-act="go:presentation"]').click();await page.screenshot({path:'docs/screenshots/after-presentation.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('#toggle-nav').click();await page.locator('#nav-backdrop').click({position:{x:10,y:10}});assert.equal(await page.locator('#nav-backdrop').isVisible(),false);await page.screenshot({path:'docs/screenshots/after-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);await browser.close();console.log('Real browser checks passed, screenshots saved.');
})().catch(e=>{console.error(e);process.exitCode=1});
