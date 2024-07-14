const api = new Gadget();

document.addEventListener("click", function (e) {
  const minusQty = e.target.closest("[data-quantity-minus]");
  const plusQty = e.target.closest("[data-quantity-plus]");

  if (minusQty) {
    let currentValue = parseInt(
      document.querySelector("[data-quantity-selector-field]").value
    );
    if (currentValue !== 1) {
      document
        .querySelector("[data-quantity-selector-field]")
        .setAttribute("value", currentValue--);
    }
  }

  if (plusQty) {
    let currentValue = parseInt(
      document.querySelector("[data-quantity-selector-field]").value
    );
    document
      .querySelector("[data-quantity-selector-field]")
      .setAttribute("value", currentValue++);
  }
});

// (async () => {
//   const results = await api.tieredDiscounts.findMany({
//     first: 250,
//     select: {
//       mode: true,
//       collections: true,
//       products: true,
//       tiers: {
//         edges: {
//           node: {
//             id: true,
//             type: true,
//             subtitle: true,
//             quantity: true,
//             discountAmount: true,
//             title: true,
//           },
//         },
//       },
//     },
//   });

//   const currentProductId = document.querySelector(
//     ".tieredDiscount[data-shopify-product]"
//   ).dataset.shopifyProduct;

//   if (results) {
//     let filtered = results.filter((tierDiscount) => {
//       if (tierDiscount.mode !== "ACTIVE") {
//         return false;
//       }
//       const productIds = tierDiscount.products.map((product) =>
//         product.id.split("/").pop()
//       );
//       console.log({ productIds, currentProductId });
//       return productIds.includes(currentProductId);
//     });
//     if (filtered.length !== 0) {
//       let matchedDiscount = filtered[0];
//       console.log(matchedDiscount);
//     }
//   }
// })();
