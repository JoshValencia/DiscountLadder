import { useState, useCallback } from "react";

import {
  Page,
  Spinner,
  Text,
  Select,
  Button,
  ButtonGroup,
  Card,
  BlockStack,
  TextField,
  Layout,
  InlineStack,
  Thumbnail,
  InlineGrid,
  Icon,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";

import ComboSelector from "../components/ComboSelector";

export default function DiscountSettings({
  title,
  handleChangeTitle,
  handleSelectResourceChange,
  selectedResource,
  resourceInput,
  setResouceInputValue,
  setSelectedProducts,
  selectedProducts,
  setSelectedCollections,
  selectedCollections,
}) {
  const options = [
    { label: "Specific Products", value: "product" },
    { label: "Specific Collections", value: "collection" },
  ];

  const fireResourcePicker = async (
    selectedResource,
    resourceInput,
    selectedProducts,
    selectedCollections,
    setSelectedProducts,
    setSelectedCollections,
    shopify
  ) => {
    const selected = await shopify.resourcePicker({
      type: selectedResource,
      query: resourceInput,
      action: "select",
      selectionIds:
        selectedResource == "product"
          ? selectedProducts.map((s) => ({ id: s.id, variants: s.variants }))
          : selectedCollections.map((s) => ({
              id: s.id,
            })),
      multiple: true,
    });

    if (selected && selectedResource == "product") {
      setSelectedProducts(selected);
    }

    if (selected && selectedResource == "collection") {
      setSelectedCollections(selected);
    }
  };
  const browseBtn = useCallback(
    async () =>
      await fireResourcePicker(
        selectedResource,
        resourceInput,
        selectedProducts,
        selectedCollections,
        setSelectedProducts,
        setSelectedCollections,
        shopify
      ),
    [selectedResource, selectedProducts, selectedCollections, resourceInput]
  );

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <Text as="h2" variant="headingSm">
          Discount Settings
        </Text>
        <TextField
          label="Title"
          value={title}
          onChange={handleChangeTitle}
          autoComplete="off"
        />
        <Select
          label="Applies To"
          options={options}
          onChange={handleSelectResourceChange}
          value={selectedResource}
        />
        <InlineStack gap={100} alignItems="center">
          <div style={{ flex: "1" }}>
            <ComboSelector
              inputValue={resourceInput}
              setInputValue={setResouceInputValue}
              selectedResource={selectedResource}
              fireResourcePicker={fireResourcePicker}
              selectedCollections={selectedCollections}
              selectedProducts={selectedCollections}
              setSelectedCollections={setSelectedCollections}
              setSelectedProducts={setSelectedProducts}
            />
          </div>
          <div style={{ maxWidth: "70px" }}>
            <Button onClick={browseBtn}>Browse</Button>
          </div>
        </InlineStack>

        {selectedResource == "product" &&
          selectedProducts.map((p, index) => (
            <div
              key={index}
              style={{ borderBottom: "1px solid #EBEBEB", padding: "12px" }}
            >
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack blockAlign="center" gap={200}>
                  <Thumbnail source={p.images[0].originalSrc} />
                  <BlockStack>
                    <Text fontWeight="bold">{p.title}</Text>
                    {p.variants.length !== p.totalVariants && (
                      <Text>{p.variants.map((v) => v.title).join(",")}</Text>
                    )}
                  </BlockStack>
                </InlineStack>
                <div style={{ height: "20px", width: "20px" }}>
                  <Button
                    size="micro"
                    variant="monochromePlain"
                    onClick={() =>
                      setSelectedProducts((current) =>
                        current.filter((c) => c.id !== p.id)
                      )
                    }
                  >
                    <Icon source={XIcon} />
                  </Button>
                </div>
              </InlineStack>
            </div>
          ))}

        {selectedResource == "collection" &&
          selectedCollections.map((c, index) => (
            <div
              key={index}
              style={{ borderBottom: "1px solid #EBEBEB", padding: "12px" }}
            >
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack blockAlign="center" gap={200}>
                  <Text>{c.title}</Text>
                </InlineStack>
                <div style={{ height: "20px", width: "20px" }}>
                  <Button
                    size="micro"
                    variant="monochromePlain"
                    onClick={() =>
                      setSelectedCollections((current) =>
                        current.filter((curr) => curr.id !== c.id)
                      )
                    }
                  >
                    <Icon source={XIcon} />
                  </Button>
                </div>
              </InlineStack>
            </div>
          ))}
      </BlockStack>
    </Card>
  );
}
