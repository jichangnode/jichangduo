const resourceCards = [...document.querySelectorAll(".resource-card")];
const resourceSearch = document.querySelector("#resource-search");
const resourceCount = document.querySelector("#resource-result-count");
const resourceEmpty = document.querySelector("#resource-empty");
const resourceFilters = new Map();

function updateResourceDirectory() {
  const query = resourceSearch.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of resourceCards) {
    const matchesFilters = [...resourceFilters].every(([group, value]) => {
      return value === "all" || card.dataset[group].split(" ").includes(value);
    });
    const matchesSearch = !query || card.textContent.toLocaleLowerCase().includes(query);
    const visible = matchesFilters && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  }

  resourceCount.textContent = String(visibleCount);
  resourceEmpty.hidden = visibleCount > 0;
}

document.querySelectorAll(".resource-filter-group").forEach(group => {
  const filterType = group.dataset.filterGroup;
  resourceFilters.set(filterType, "all");

  group.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;

    group.querySelectorAll("button[data-value]").forEach(option => {
      const selected = option === button;
      option.classList.toggle("active", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    resourceFilters.set(filterType, button.dataset.value);
    updateResourceDirectory();
  });
});

resourceSearch.addEventListener("input", updateResourceDirectory);
