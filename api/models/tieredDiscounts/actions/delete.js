import { deleteRecord, ActionOptions, DeleteTieredDiscountsActionContext } from "gadget-server";

/**
 * @param { DeleteTieredDiscountsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteTieredDiscountsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  let tiersConnected = await api.tiers.findMany({
    filter: {
      tieredDiscountId: {
        equals: record.id
      }
    }
  })
  api.tiers.bulkDelete(tiersConnected.map(tier => tier.id))
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
