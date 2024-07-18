import { RouteContext } from "gadget-server";

/**
 * Route handler for POST draftorder
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
}) {
  const shopify = connections.shopify.current;

  const { draftOrder } = JSON.parse(request.body);
  if (shopify) {
    try {
      const variables = {
        id: draftOrder.node.id,
        input: {
          lineItems: draftOrder.node.lineItems.nodes.map((item) => {
            const tierMetafield = item.product.metafield;
            if (!tierMetafield) {
              return {
                variantId: item.variant.id,
                quantity: item.quantity,
              };
            }
            if (tierMetafield) {
              const matchingTier = JSON.parse(tierMetafield.value).find(
                (tier) => item.quantity <= tier.quantity
              );
              return {
                variantId: item.variant.id,
                quantity: item.quantity,
                appliedDiscount: {
                  value: matchingTier.discountAmount,
                  valueType:
                    matchingTier.type == "fixed"
                      ? "FIXED_AMOUNT"
                      : "PERCENTAGE",
                },
              };
            }
          }),
        },
      };

      const draftOrders = await shopify.graphql(
        `
            mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
                draftOrderUpdate(id: $id, input: $input) {
                    draftOrder {
                        id
                    }
                }
            }
              `,
        variables
      );

      return reply.send(draftOrders);
    } catch (err) {
      logger.error(err);
      return reply.send([]);
    }
  }
  return reply.send([]);
}
