import { useFindFirst, useQuery, useFindMany } from "@gadgetinc/react";
import { useState, useCallback } from "react";
import { Modal } from "@shopify/app-bridge-react";
import {
  Page,
  Text,
  Button,
  ButtonGroup,
  Card,
  BlockStack,
  Layout,
  InlineStack,
  Spinner,
} from "@shopify/polaris";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

import {
  generateUniqueRandomString,
  TieredDiscount,
} from "../helper/generation";
import { DISCOUNT_TYPES } from "../helper/constants";
import Tier from "../components/Tier";
import DiscountSettings from "../components/DiscountSetting";

function Tiers({ tiers, setTiers, modifyMode }) {
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <Text as="h2" variant="headingSm">
          Tiers
        </Text>
        {tiers.map((tier, index) => (
          <Tier
            key={index}
            order={index + 1}
            quantity={tier.quantity}
            discountAmount={tier.discountAmount}
            title={tier.title}
            subtitle={tier.subtitle}
            type={tier.type}
            setTiers={setTiers}
            id={tier.id}
            tiers={tiers}
            modifyMode={modifyMode}
          />
        ))}
      </BlockStack>
    </Card>
  );
}

export default function () {
  const [submitting, setSubmitStatus] = useState(false);
  let { state } = useLocation();
  let modifyMode = state && state.mode ? state.mode : "CREATE";
  let duplicateState =
    state && state.current ? JSON.parse(state.current) : null;
  const [existingID, setExistingID] = useState(
    duplicateState && duplicateState?.id ? duplicateState.id : ""
  );
  const [title, setTitle] = useState(
    duplicateState && duplicateState?.title ? duplicateState.title : ""
  );

  const handleChangeTitle = useCallback((newValue) => setTitle(newValue), []);
  const [modifyStatus, setModifyStatus] = useState(modifyMode);

  const [tiers, setTiers] = useState(
    duplicateState && duplicateState?.tiers
      ? duplicateState.tiers.edges.map((t) => {
          let node = t.node;
          if (modifyMode == "EDIT") {
            node["status"] = "OLD";
          }
          return node;
        })
      : [
          {
            id: generateUniqueRandomString(8),
            quantity: 0,
            title: "",
            subtitle: "",
            type: DISCOUNT_TYPES[0],
            discountAmount: 0,
          },
        ]
  );
  const [resourceInput, setResouceInputValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(
    duplicateState && duplicateState?.products ? duplicateState.products : []
  );
  const [selectedCollections, setSelectedCollections] = useState(
    duplicateState && duplicateState?.collections
      ? duplicateState.collections
      : []
  );

  const [selectedResource, setSelectedResource] = useState(
    duplicateState && duplicateState?.applies_to
      ? duplicateState.applies_to
      : "product"
  );

  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);

  const handleSelectResourceChange = useCallback((value) => {
    setSelectedResource(value);
    setSelectedProducts([]);
    setSelectedCollections([]);
  }, []);

  const gadgetMutateDiscount = async (
    title,
    selectedResource,
    selectedProducts,
    selectedCollections,
    tiers,
    status,
    data,
    modifyMode,
    existingID
  ) => {
    const newTieredDiscount = new TieredDiscount(
      title,
      selectedResource,
      selectedProducts,
      selectedCollections,
      tiers,
      status,
      data.id,
      modifyMode,
      existingID
    );

    let tieredDiscount = newTieredDiscount.checkValidity();

    if (modifyMode == "EDIT") {
      const tieredUpdateResult = await api.tieredDiscounts.update(
        tieredDiscount.id,
        {
          title: tieredDiscount.title,
          applies_to: tieredDiscount.applies_to,
          mode: tieredDiscount.mode,
          collections: tieredDiscount.collections,
          products: tieredDiscount.products,
          tiers: tieredDiscount.tiers,
        },
        {
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
        }
      );

      setTiers(
        tieredUpdateResult.tiers.edges.map((t) => {
          let node = t.node;
          node["status"] = "OLD";
          return node;
        })
      );
    }

    if (modifyMode == "CREATE") {
      const tieredCreationResult = await api.tieredDiscounts.create(
        {
          title: tieredDiscount.title,
          applies_to: tieredDiscount.applies_to,
          mode: tieredDiscount.mode,
          collections: tieredDiscount.collections,
          products: tieredDiscount.products,
          tiers: tieredDiscount.tiers,
          shop: {
            _link: data.id,
          },
        },
        {
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
        }
      );
      navigate("/create-discount", {
        state: {
          current: JSON.stringify(tieredCreationResult),
          mode: "EDIT",
        },
      });
    }
  };

  const handleDraftDiscount = useCallback(async () => {
    setSubmitStatus(true);
    await gadgetMutateDiscount(
      title,
      selectedResource,
      selectedProducts,
      selectedCollections,
      tiers,
      "DRAFT",
      data,
      modifyMode,
      existingID
    );
    setSubmitStatus(false);
    shopify.toast.show("Tiered Discount Saved & Drafted");
  }, [
    tiers,
    title,
    selectedResource,
    selectedProducts,
    selectedCollections,
    data,
    modifyMode,
    existingID,
  ]);

  const handlePublishDiscount = useCallback(async () => {
    setSubmitStatus(true);
    await gadgetMutateDiscount(
      title,
      selectedResource,
      selectedProducts,
      selectedCollections,
      tiers,
      "ACTIVE",
      data,
      modifyMode,
      existingID
    );
    setSubmitStatus(false);
    shopify.toast.show("Tiered Discount Saved & Published");
  }, [
    tiers,
    title,
    selectedResource,
    selectedProducts,
    selectedCollections,
    data,
    modifyMode,
    existingID,
  ]);

  const navigate = useNavigate();

  if (submitting) {
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
      backAction={{ content: "Dashboard", onAction: () => navigate("/") }}
      title={(modifyMode == "EDIT" ? "Edit" : "Create") + " Tiered Discount"}
      primaryAction={
        <Button variant="primary" onClick={handlePublishDiscount}>
          {" "}
          Publish
        </Button>
      }
      secondaryActions={
        <ButtonGroup>
          <Button onClick={handleDraftDiscount}>Save as Draft</Button>
          <Button
            variant="primary"
            tone="critical"
            onClick={() => shopify.modal.show("delete-confirm-modal")}
          >
            Delete
          </Button>
        </ButtonGroup>
      }
    >
      <Modal id="delete-confirm-modal">
        <div style={{ padding: "20px" }}>
          <BlockStack align="center" gap="500">
            <Text alignment="center" fontWeight="bold">
              Do you really want to delete this Tiered Discount?
            </Text>
            <InlineStack align="center" gap="200">
              <Button
                variant="primary"
                tone="critical"
                onClick={async () => {
                  setSubmitStatus(true);
                  if (modifyStatus == "EDIT") {
                    await api.tieredDiscounts.delete(existingID);

                    setSubmitStatus(false);
                    navigate("/");
                  } else {
                    setSubmitStatus(false);
                    navigate("/");
                  }
                }}
              >
                Confirm
              </Button>
              <Button
                variant="primary"
                onClick={() => shopify.modal.hide("delete-confirm-modal")}
              >
                Cancel
              </Button>
            </InlineStack>
          </BlockStack>
        </div>
      </Modal>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <DiscountSettings
              title={title}
              handleChangeTitle={handleChangeTitle}
              selectedResource={selectedResource}
              handleSelectResourceChange={handleSelectResourceChange}
              setResouceInputValue={setResouceInputValue}
              resourceInput={resourceInput}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              setSelectedCollections={setSelectedCollections}
              selectedCollections={selectedCollections}
            />
            <Tiers setTiers={setTiers} tiers={tiers} modifyMode={modifyMode} />
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Summary
                </Text>
                <Text as="p" variant="bodyMd">
                  {title == "" ? "Not Set" : title}
                </Text>
              </BlockStack>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Applies To
                </Text>
                <Text as="p" variant="bodyMd">
                  {selectedProducts.length == 0 &&
                  selectedCollections.length == 0
                    ? "Not Set"
                    : selectedResource == "product"
                    ? selectedProducts.length
                    : selectedCollections.length}{" "}
                  {(selectedProducts.length !== 0 ||
                    selectedCollections.length !== 0) &&
                    selectedResource +
                      `${
                        selectedProducts.length > 1 ||
                        selectedCollections.length > 1
                          ? "s"
                          : ""
                      }`}
                  {selectedResource == "collection" &&
                    selectedCollections.length > 1 &&
                    `(${selectedCollections.reduce(
                      (acc, col) => col.productsCount + acc,
                      0
                    )}) total products`}
                </Text>
              </BlockStack>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Tiers
                </Text>
                <Text as="p" variant="bodyMd">
                  {tiers.length} tier
                  {tiers.length > 1 && "s"}
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <div style={{ height: "50px" }}></div>
    </Page>
  );
}
