import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-04",
        enabledModels: [
          "shopifyAsset",
          "shopifyDiscount",
          "shopifyDiscountCode",
          "shopifyPriceRule",
          "shopifyProduct",
          "shopifyProductImage",
          "shopifyScriptTag",
          "shopifyTheme",
        ],
        type: "partner",
        scopes: [
          "read_discounts",
          "write_discounts",
          "read_price_rules",
          "write_products",
          "read_products",
          "write_script_tags",
          "read_script_tags",
          "write_themes",
          "read_themes",
        ],
      },
    },
  },
};
