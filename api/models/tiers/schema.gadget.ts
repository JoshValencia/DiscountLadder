import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "tier" model, go to https://discount-ladder.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "WviwrZvJl6a4",
  fields: {
    discountAmount: {
      type: "number",
      default: 0,
      storageKey: "Ak56LxO36EaY",
    },
    quantity: {
      type: "number",
      default: 0,
      storageKey: "4cs2TE03SU4c",
    },
    subtitle: { type: "string", storageKey: "Rx_flAY9jPOo" },
    tieredDiscount: {
      type: "belongsTo",
      parent: { model: "tieredDiscounts" },
      storageKey: "uT7LrcDDwoa8",
    },
    title: { type: "string", storageKey: "LfZVcILYvs2s" },
    type: {
      type: "enum",
      default: "default",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["default", "percent", "fixed"],
      storageKey: "ZJUmkDdvG_qG",
    },
  },
};
