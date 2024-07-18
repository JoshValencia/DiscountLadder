import { RouteContext } from "gadget-server";

/**
 * Route handler for getDraftOrders
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

  if (shopify) {
    try {
      const draftOrders = await shopify.graphql(
        `
         query {
          draftOrders(first: 20, reverse: true) {
            edges {
              node {
                id
                name
                createdAt
                lineItems (first: 20){
                    nodes{
                    id
                    variant{
                      id
                    }
                    quantity
                    product{
                        id
                        metafield(key:"tiers",namespace:"discount"){
                          value
                        }
                      }
                    }
                  
                  
                }
              }
            }
          }
        }
        `
      );

      return reply.send(draftOrders.draftOrders.edges);
    } catch (err) {
      logger.error(err);
      return reply.send([]);
    }
  }
  return reply.send([]);
}
