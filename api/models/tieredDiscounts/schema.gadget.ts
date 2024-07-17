import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "tieredDiscounts" model, go to https://discount-ladder.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "78xTuw5oXxzT",
  fields: {
    applies_to: { type: "string", storageKey: "h63cjEK4uu6H" },
    collections: {
      type: "json",
      default: [],
      storageKey: "z37iMu1rUUD0",
    },
    mode: {
      type: "enum",
      default: "DRAFT",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["DRAFT", "ACTIVE"],
      storageKey: "lcIj1VA3_Wif",
    },
    products: {
      type: "json",
      default: [],
      storageKey: "kIDjje34sRX7",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "Y3uSWg2wX46_",
    },
    shopifyProducts: {
      type: "hasMany",
      children: { model: "shopifyProduct", belongsToField: "tiers" },
      storageKey: "8HDXz1BTkHGp",
    },
    tiers: {
      type: "hasMany",
      children: { model: "tiers", belongsToField: "tieredDiscount" },
      storageKey: "Mp9yziwjzFFi",
    },
    title: { type: "string", storageKey: "LhocSCSXBGc3" },
  },
};
