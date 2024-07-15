// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */
/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */

export function run(input) {
  const discountApply = (
    discountAmount,
    originalPrice,
    type,
    pureFloat = false
  ) => {
    if (type === "percent") {
      let decimalDiscount = discountAmount / 100;
      let discountedPrice = originalPrice - originalPrice * decimalDiscount;
      return parseFloat(discountedPrice.toFixed(2));
    }
    if (type === "fixed") {
      let discountedPrice = originalPrice - discountAmount;
      return parseFloat(discountedPrice.toFixed(2));
    }
    if (type === "default") {
      let discountedPrice = originalPrice;
      return parseFloat(discountedPrice.toFixed(2));
    }
  };

  const cartItems = input.cart.lines
    // Only include cart lines with a quantity of two or more
    .filter((line) => line.quantity >= 2 && line.attribute?.key == "_tiers")
    .map((line) => {
      let originalTotal = parseFloat(
        parseFloat(line.cost.totalAmount.amount).toFixed(2)
      );
      let matchingTier = JSON.parse(line.attribute?.value).find(
        (tier) => line.quantity <= tier.quantity
      );
      let discountedTotal = discountApply(
        matchingTier.discountAmount,
        originalTotal,
        matchingTier.type
      );

      console.log(JSON.stringify({ originalTotal, discountedTotal }));

      let totalValueToBeDeduct = originalTotal - discountedTotal;
      return {
        targets: [
          // Use the cart line ID to create a discount target
          {
            cartLine: {
              id: line.id,
            },
          },
        ],
        value: {
          fixedAmount: {
            amount: String(totalValueToBeDeduct),
          },
        },
      };
    });

  if (!cartItems.length) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    discounts: cartItems,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
