import { launch } from 'puppeteer';

export async function processor(url: string): Promise<string | null> {
  console.log("Processing job URL:", url);
  const browser = await launch({
    headless: true, // Use the new headless mode for better performance
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for network to be idle
    // do stuff
    // look for a span class="text-base flex-1"
    const jobTitle = await page.$eval('span.text-base.flex-1', (el) => el.textContent.trim());
    console.log("Job Title:", jobTitle);
    await browser.close();
    return jobTitle; // Return the job title
  } catch (error) {
    console.error("Error processing URL:", url, error);
    await browser.close(); // Ensure browser is closed even on error
    return null; // Return null to indicate failure
  }
}