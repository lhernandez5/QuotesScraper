document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/scraped-data");
    const data = await response.json();
    const list = document.getElementById("quoteList");
    
    //JSON data is dynamically created and appended to <li> elemented to <ul>
    data.forEach((quoteList) => {
      quoteList.map((quote) => {
        const listItem = document.createElement("li");
        listItem.textContent = quote.text + " " + quote.author;
        list.appendChild(listItem);
      });
    });
  } catch (error) {
    console.log("Error fetching scraped data: ", error);
  }
});
