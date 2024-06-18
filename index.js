import puppeteer from "puppeteer";

const getQuotes = async () => {
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

    console.log(quotes.length);

    if (nextPageLink) {
      // click the next page link
      await nextPageLink.click();

      // wait for navigation to complete
      await page.waitForNavigation();
    } else {
      console.log("No more pages to read.");
      lastPageReached = true;
    }
  } while (!lastPageReached);

  // close the browser
  await browser.close();
};

getQuotes();
