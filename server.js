import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

const scrapeQuotes = async () => {
  // puppeteer session started with a
  // visible browser-easier to debug
  // and no default viewport-page will be in full width and height
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // open a new page
  const page = await browser.newPage();

  // on new page open to this website and wait the DOM content to be loaded
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  let lastPageReached = false;
  const data_points = [];
  do {
    const nextPageLink = await page.$(".pager > .next > a");

    const data = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");
      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerHTML;
        const author = quote.querySelector(".author").innerHTML;
        return { text, author };
      });
    });

    if (nextPageLink) {
      await nextPageLink.click();
      await page.waitForNavigation();
    } else {
      console.log("No more pages to read.");
      lastPageReached = true;
    }
    // return data;
    data_points.push(data);
  } while (!lastPageReached);
  return data_points;
  // await browser.close();
  // return data;
};

app.get("/scraped-data", async (req, res) => {
  try {
    const data = await scrapeQuotes();
    res.json(data);
  } catch (error) {
    console.log("Error scraping website:", error);
    res.status(500).json({ error });
  }
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
