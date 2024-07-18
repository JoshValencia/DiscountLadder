import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyDraftOrderLineItem" model, go to https://discount-ladder.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-DraftOrderLineItem",
  fields: {},
  shopify: {
    fields: [
      "appliedDiscount",
      "custom",
      "draftOrder",
      "fulfillmentService",
      "giftCard",
      "grams",
      "name",
      "price",
      "product",
      "properties",
      "quantity",
      "requiresShipping",
      "shop",
      "sku",
      "taxLines",
      "taxable",
      "title",
      "variantTitle",
      "vendor",
    ],
  },
};
