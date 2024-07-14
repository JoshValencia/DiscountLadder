const api = new Gadget();

const priceFormatter = (price, symbol = true, number = false) => {
  let priceLength = price.toString().length;
  let decimal = price.toString().substring(priceLength, priceLength - 2);
  let wholeNumber = price.toString().substring(0, priceLength - 2);
  let arrange = wholeNumber.includes(".")
    ? wholeNumber.concat("", decimal)
    : wholeNumber.concat(".", decimal);
  if (number) {
    return parseFloat(arrange);
  }
  return `${symbol == true ? "$" : ""}${parseFloat(arrange).toLocaleString()}`;
};

const discountedBulkPrice = (discountAmount, price, quantity, type) => {
  let formattedPrice = priceFormatter(parseInt(price), false, true);

  if (type === "percent") {
    let decimalDiscount = discountAmount / 100;
    let discountedPrice =
      formattedPrice * quantity - formattedPrice * quantity * decimalDiscount;
    return discountedPrice.toLocaleString();
  }
  if (type === "fixed") {
    let discountedPrice = formattedPrice * quantity - discountAmount;
    return discountedPrice.toLocaleString();
  }
  if (type === "default") {
    return (formattedPrice * quantity).toLocaleString();
  }
};

const tierTemplate = (
  price,
  subtitle,
  symbol,
  quantity,
  discountAmount,
  type,
  title
) => `
        <div class="tierItem">
      <span class="tierPrice"
        ><span>${title}</span> <span>${symbol}</span>${discountedBulkPrice(
  discountAmount,
  price,
  quantity,
  type
)}</span
      >
      <span class="tierSubtitle">${subtitle}</span>
    </div>
        `;

document.addEventListener("DOMContentLoaded", async (event) => {
  const currentProductID = document.querySelector(
    ".tieredDiscount[data-shopify-product]"
  ).dataset.shopifyProduct;
  const currentProductCollections = JSON.parse(
    document.querySelector(`#tieredProductCollections--${currentProductID}`)
      .innerHTML
  ).map((collection) => String(collection.id));
  const currentProductPrice = document.querySelector(
    ".tieredDiscount[data-shopify-product]"
  ).dataset.price;

  const currentProductSymbol = document.querySelector(
    ".tieredDiscount[data-shopify-product]"
  ).dataset.symbol;

  const results = await api.tieredDiscounts.findMany({
    first: 250,
    select: {
      mode: true,
      collections: true,
      products: true,
      tiers: {
        edges: {
          node: {
            id: true,
            type: true,
            subtitle: true,
            quantity: true,
            discountAmount: true,
            title: true,
          },
        },
      },
    },
  });
  const currentProductId = document.querySelector(
    ".tieredDiscount[data-shopify-product]"
  ).dataset.shopifyProduct;
  if (results) {
    let filtered = results.filter((tierDiscount) => {
      if (tierDiscount.mode !== "ACTIVE") {
        return false;
      }
      if (tierDiscount.collections.length !== 0) {
        const collectionIDs = tierDiscount.collections.map((collection) =>
          collection.id.split("/").pop()
        );
        let matched = false;
        for (let item of currentProductCollections) {
          if (collectionIDs.includes(item)) {
            matched = true;
            break;
          }
        }
        return matched;
      }
      if (tierDiscount.products.length !== 0) {
        const productIds = tierDiscount.products.map((product) =>
          product.id.split("/").pop()
        );
        return productIds.includes(currentProductId);
      }
    });
    if (filtered.length !== 0) {
      document.querySelector(
        ".tieredDiscount[data-shopify-product]"
      ).style.display = "block";
      let matchedDiscount = filtered[0];

      window.tiers = matchedDiscount.tiers.edges.map((n) => n.node);

      let tierDiscount = window.tiers.find((tier) => 1 <= tier.quantity);

      document.querySelector(".tierTotalPrice").innerHTML = discountedBulkPrice(
        tierDiscount.discountAmount,
        currentProductPrice,
        tierDiscount.quantity,
        tierDiscount.type
      );

      document.querySelector(".tiersContainer").innerHTML =
        matchedDiscount.tiers.edges
          .map((n) => {
            let tier = n.node;
            return tierTemplate(
              currentProductPrice,
              tier.subtitle,
              currentProductSymbol,
              tier.quantity,
              tier.discountAmount,
              tier.type,
              tier.title
            );
          })
          .join("");
    }
  }
  document
    .querySelector(".tiersQuantitySelector > button[data-quantity-minus]")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let currentValue = parseInt(
        document.querySelector("[data-quantity-selector-field]").value
      );
      if (currentValue < 2) {
        document
          .querySelector(".tiersQuantitySelector > button[data-quantity-minus]")
          .setAttribute("disabled", "");
      }

      let tierDiscount = window.tiers.find(
        (tier) => currentValue - 1 <= tier.quantity
      );

      document.querySelector(".tierTotalPrice").innerHTML = discountedBulkPrice(
        tierDiscount.discountAmount,
        currentProductPrice,
        tierDiscount.quantity,
        tierDiscount.type
      );

      if (currentValue !== 1) {
        document.querySelector("[data-quantity-selector-field]").value =
          currentValue - 1;
        document.querySelector("[data-quantity-selector-field]").defaultValue =
          currentValue - 1;
      }
    });

  document
    .querySelector(".tiersQuantitySelector > button[data-quantity-plus]")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let currentValue = parseInt(
        document.querySelector("[data-quantity-selector-field]").value
      );

      if (currentValue > 1) {
        document
          .querySelector(".tiersQuantitySelector > button[data-quantity-minus]")
          .removeAttribute("disabled");
      }

      let tierDiscount = window.tiers.find(
        (tier) => currentValue + 1 <= tier.quantity
      );

      document.querySelector(".tierTotalPrice").innerHTML = discountedBulkPrice(
        tierDiscount.discountAmount,
        currentProductPrice,
        tierDiscount.quantity,
        tierDiscount.type
      );

      document.querySelector("[data-quantity-selector-field]").value =
        currentValue + 1;
      document.querySelector("[data-quantity-selector-field]").defaultValue =
        currentValue + 1;
    });
});
