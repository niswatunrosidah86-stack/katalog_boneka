
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const productGrids = document.querySelectorAll(".product-grid");
const brandHeadings = document.querySelectorAll(".brand-heading");

const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("detailModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");

let selectedCategory = "semua";
let lastDetailButton = null;

function filterProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        const matchesSearch =
            name.includes(keyword) ||
            description.includes(keyword) ||
            category.includes(keyword);

        const matchesCategory =
            selectedCategory === "semua" ||
            category === selectedCategory;

        const visible = matchesSearch && matchesCategory;

        card.hidden = !visible;

        if (visible) {
            visibleCount++;
        }
    });

    productGrids.forEach((grid, index) => {
        const visibleCards = grid.querySelectorAll(
            ".product-card:not([hidden])"
        );

        const hasVisibleCards = visibleCards.length > 0;

        grid.hidden = !hasVisibleCards;

        if (brandHeadings[index]) {
            brandHeadings[index].hidden = !hasVisibleCards;
        }
    });

    resultCount.textContent = `${visibleCount} koleksi`;
    emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterProducts);

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        filterProducts();
    });
});

document.querySelectorAll(".heart-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const isFavorite = button.classList.toggle("favorited");

        button.textContent = isFavorite ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isFavorite));

        const name = button
            .closest(".product-card")
            .querySelector("h3").textContent;

        button.setAttribute(
            "aria-label",
            `${isFavorite ? "Hapus dari" : "Tambahkan ke"} favorit: ${name}`
        );
    });
});

document.querySelectorAll(".detail-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const image = card.querySelector(".product-image img");

        lastDetailButton = button;

        modalImage.src = image.src;
        modalImage.alt = image.alt;

        modalTitle.textContent =
            card.querySelector("h3").textContent;

        modalCategory.textContent =
            card.querySelector(".product-category").textContent;

        modalDescription.textContent =
            card.dataset.description;

        modal.hidden = false;
        document.body.style.overflow = "hidden";

        document.getElementById("closeModal").focus();
    });
});

function closeDetail() {
    modal.hidden = true;
    document.body.style.overflow = "";

    if (lastDetailButton) {
        lastDetailButton.focus();
    }
}

document.getElementById("closeModal")
    .addEventListener("click", closeDetail);

document.getElementById("doneModal")
    .addEventListener("click", closeDetail);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeDetail();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeDetail();
    }
});

filterProducts();
