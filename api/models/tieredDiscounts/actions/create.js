import { applyParams, save, ActionOptions, CreateTieredDiscountsActionContext } from "gadget-server";

/**
 * @param { CreateTieredDiscountsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateTieredDiscountsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
