document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/scraped-data");
    const data = await response.json();

    const list = document.getElementById("quoteList");

    data.forEach((item) => {
      console.log("item: " + typeof item);
      console.log(item);
      item.map((quote) => {
        const listItem = document.createElement("li");
        listItem.textContent = quote.text + " " + quote.author;
        list.appendChild(listItem);
      });
    });
  } catch (error) {
    console.log("Error fetching scraped data: ", error);
  }
});
