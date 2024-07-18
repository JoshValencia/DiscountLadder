import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyDraftOrder" model, go to https://discount-ladder.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-DraftOrder",
  fields: {},
  shopify: {
    fields: [
      "appliedDiscount",
      "billingAddress",
      "completedAt",
      "currency",
      "email",
      "invoiceSentAt",
      "invoiceUrl",
      "lineItems",
      "name",
      "note",
      "noteAttributes",
      "order",
      "poNumber",
      "shippingAddress",
      "shippingLine",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "status",
      "subtotalPrice",
      "tags",
      "taxExempt",
      "taxExemptions",
      "taxLines",
      "taxesIncluded",
      "totalPrice",
      "totalTax",
    ],
  },
};
