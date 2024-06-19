import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

//puppeteer function to scrape quotes
const scrapeQuotes = async () => {
  // puppeteer session started with a visible browser-easier to debug
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
  const data = [];

  //scrape quotes will there is a next page
  do {
    const nextPageLink = await page.$(".pager > .next > a");

    const quotes = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");
      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerHTML;
        const author = quote.querySelector(".author").innerHTML;
        return { text, author };
      });
    });

    if (nextPageLink) {
      // click the next page link
      await nextPageLink.click();
      // wait for navigation to complete
      await page.waitForNavigation();
    } else {
      console.log("No more pages to read.");
      lastPageReached = true;
    }

    data.push(quotes);
  } while (!lastPageReached);

  await browser.close();
  return data;
};

//with this api endpoint the server will provide the scraped data from scrapeQuotes function
app.get("/scraped-data", async (req, res) => {
  try {
    const data = await scrapeQuotes();
    //scraped data is sent to client as JSON response
    res.json(data);
  } catch (error) {
    console.log("Error scraping website:", error);
    res.status(500).json({ error });
  }
});

// this middleware serves static files from the 'public' directory
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
