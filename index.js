import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  let lastPageReached = false;

  while (!lastPageReached) {
    const nextPageLink = await page.$(".pager > .next > a");

    if (!nextPageLink) {
      console.log("No more pages to read.");
      lastPageReached = true;
    } else {
      await nextPageLink.click();

      await page.waitForNavigation();

      const quotes = await page.evaluate(() => {
        const quoteList = document.querySelectorAll(".quote");
        return Array.from(quoteList).map((quote) => {
          const text = quote.querySelector(".text").innerHTML;
          const author = quote.querySelector(".author").innerHTML;
          return { text, author };
        });
      });
    }
  }

  console.log(quotes);
  //   await browser.close();
};

getQuotes();
