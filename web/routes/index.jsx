import { useFindFirst, useFindMany, useQuery } from "@gadgetinc/react";
import {
  Page,
  Spinner,
  Text,
  LegacyCard,
  Link,
  Button,
  EmptyState,
} from "@shopify/polaris";
import { StoreIcon } from "@shopify/polaris-icons";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { MAX_RECORD } from "../helper/constants";
import { useCallback, useState } from "react";
import DiscountsList from "../components/DiscountsList";

export default function () {
  const navigate = useNavigate();

  const [cursor, setCursor] = useState({ first: MAX_RECORD });
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [
    {
      data: tieredDiscounts,
      fetching: tieredDiscountsFetching,
      error: tieredDiscountsError,
    },
    _refetch,
  ] = useFindMany(api.tieredDiscounts, {
    ...cursor,
    select: {
      id: true,
      mode: true,
      collections: true,
      products: true,
      applies_to: true,
      title: true,
      tiers: {
        edges: {
          node: {
            id: true,
            type: true,
            subtitle: true,
            quantity: true,
            discountAmount: true,
            title: true,
          },
        },
      },
    },
  });

  const pageForward = useCallback(() => {
    if (tieredDiscounts?.hasNextPage) {
      setCursor({ after: tieredDiscounts.endCursor, first: MAX_RECORD });
    }
  }, [tieredDiscounts]);

  const pageBackward = useCallback(() => {
    if (tieredDiscounts?.hasPreviousPage) {
      setCursor({ before: tieredDiscounts.startCursor, last: MAX_RECORD });
    }
  }, [tieredDiscounts]);

  if (error || tieredDiscountsError) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error && error.toString()}
          {tieredDiscountsError && tieredDiscountsError.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || tieredDiscountsFetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <Page
      title="Tiered Discounts"
      primaryAction={
        <Button variant="primary" onClick={() => navigate("/create-discount")}>
          Create Tiered Discount
        </Button>
      }
    >
      {tieredDiscounts.length == 0 && (
        <LegacyCard sectioned>
          <EmptyState
            heading="You have no tiered discounts"
            action={{
              content: "Create Tiered Discount",
              onAction: () => navigate("/create-discount"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Create automatic discounts that apply at cart and checkout.</p>
          </EmptyState>
        </LegacyCard>
      )}

      {tieredDiscounts.length !== 0 && (
        <DiscountsList discounts={tieredDiscounts} refetchDiscount={_refetch} />
      )}
    </Page>
  );
}
