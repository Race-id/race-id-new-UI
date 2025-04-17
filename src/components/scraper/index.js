import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateEvent, formatDate } from './utils.js';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeRaceEvents() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1366, height: 768 }
  });
  const page = await browser.newPage();
  const allEvents = [];

  // Define years and their URLs
  const yearsData = [
    { year: '2019', url: 'https://kalenderlari.com/jadwal-2019/' },
    { year: '2020', url: 'https://kalenderlari.com/jadwal-2020/' },
    { year: '2021', url: 'https://kalenderlari.com/jadwal-2021/' },
    { year: '2022', url: 'https://kalenderlari.com/jadwal-event-lari-2022/' },
    { year: '2023', url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2023/' },
    { year: '2024', url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2024/' },
    { year: '2025', url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2025/' }
  ];

  try {
    for (const yearData of yearsData) {
      console.log(`Scraping data tahun ${yearData.year}...`);
      
      await page.goto(yearData.url);
      await page.waitForSelector('table', { timeout: 10000 });

      const events = await page.evaluate((year) => {
        const rows = document.querySelectorAll('table tr');
        return Array.from(rows).slice(1).map(row => {
          const cells = row.querySelectorAll('td');
          return {
            title: cells[1]?.querySelector('a')?.textContent.trim(),
            date: cells[0]?.textContent.trim(),
            url: cells[1]?.querySelector('a')?.href,
            year: year
          };
        });
      }, yearData.year);

      allEvents.push(...events);
      
      // Add delay between requests
      await new Promise(r => setTimeout(r, 2000));
    }

    // Filter dan format data
    const validEvents = allEvents
      .filter(validateEvent)
      .map(event => ({
        title: event.title,
        date: formatDate(event.date),
        url: event.url,
        year: event.year
      }));

    // Save to JSON
    fs.writeFileSync(
      path.resolve(__dirname, '../data/events.json'),
      JSON.stringify(validEvents, null, 2)
    );

    console.log(`Berhasil mengambil ${validEvents.length} events dari 2019-2025`);

  } catch (error) {
    console.error('Error:', error);
    console.error('Error details:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeRaceEvents();