async function search() {
  const q = searchInput.value || "pokemon";
  loadingEl.style.display = "block";
  resultsEl.innerHTML = "";

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    const items = data.results || data.items || [];

    if (!items.length) {
      resultsEl.innerHTML = "<p>No results found</p>";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${item.img || item.image || ""}" />
        <h4>${item.title}</h4>
        <p class="price">${item.price}</p>
        <a href="${item.link || item.url}" target="_blank">View on eBay</a>
      `;

      resultsEl.appendChild(card);
    });
  } catch (err) {
    console.error("Search failed:", err);
    resultsEl.innerHTML = "<p>Error loading results</p>";
  } finally {
    loadingEl.style.display = "none";
  }
}
