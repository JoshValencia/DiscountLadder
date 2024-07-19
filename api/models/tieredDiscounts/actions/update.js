import {
  applyParams,
  save,
  ActionOptions,
  UpdateTieredDiscountsActionContext,
} from "gadget-server";

/**
 * @param { UpdateTieredDiscountsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { UpdateTieredDiscountsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shopify = await connections.shopify.forShopId(record.shopId);
  const tiers = await api.tiers.findMany({
    filter: {
      tieredDiscountId: {
        equals: record.id,
      },
    },
  });
  if (shopify) {
    try {
      const {
        products: { edges },
      } = await shopify.graphql(
        `
       query($tag:String) {
  products(first: 250, query:$tag) {
    edges {
      node {
        id
        tags
      }
    }
  }
}
        `,
        {
          tag: `tier-${record.id}`,
        }
      );

      for (let taggedProduct of edges) {
        const id = taggedProduct.node.id.split("/").pop();
        const tags = taggedProduct.node.tags;
        const responseProduct = await shopify.product.update(id, {
          id,
          tags: tags.filter((tag) => !tag.startsWith("tier")).join(","),
        });
        const response = await shopify.graphql(
          `
          mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                key
                namespace
                value
                createdAt
                updatedAt
              }
              userErrors {
                field
                message
                code
              }
            }
          }
          `,
          {
            metafields: [
              {
                key: "tiers",
                namespace: "discount",
                ownerId: taggedProduct.node.id,
                type: "json",
                value: JSON.stringify([]),
              },
            ],
          }
        );
      }
      for (let product of record.products) {
        const id = product.id.split("/").pop();
        let filteredTags = product.tags.filter(
          (tag) => !tag.startsWith("tier")
        );
        filteredTags.push(`tier-${record.id}`);

        const responseProduct = await shopify.product.update(id, {
          id,
          tags: filteredTags.join(","),
        });
        const response = await shopify.graphql(
          `
          mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                key
                namespace
                value
                createdAt
                updatedAt
              }
              userErrors {
                field
                message
                code
              }
            }
          }
          `,
          {
            metafields: [
              {
                key: "tiers",
                namespace: "discount",
                ownerId: product.id,
                type: "json",
                value: JSON.stringify(tiers),
              },
            ],
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
