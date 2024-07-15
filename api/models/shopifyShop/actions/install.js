import { applyParams, save, ActionOptions, InstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shopify = connections.shopify.current;
  if (shopify) {
    await shopify.graphql(`
        mutation {
          discountAutomaticAppCreate(automaticAppDiscount: {
            title: "TieredDiscount",
            functionId: "e1114b75-3aef-4d56-8924-d73f5f9191fa",
            startsAt: "2022-06-22T00:00:00"
          }) {
            automaticAppDiscount {
              discountId
            }
            userErrors {
              field
              message
            }
          }
        }
    `)
  }
};

/** @type { ActionOptions } */
export const options = { actionType: "create" };
