import {
  Badge,
  BlockStack,
  Box,
  Button,
  Icon,
  IndexTable,
  InlineStack,
  LegacyCard,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import React, { useCallback, useState } from "react";
import { capitalizeFirstLetter } from "../helper/generation";
import { api } from "../api";
import { Modal } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";

export default function DiscountsList({ discounts, refetchDiscount }) {
  const navigate = useNavigate();
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const handleDeleteDiscount = useCallback(async () => {
    if (selectedDiscount !== "") {
      await api.tieredDiscounts.delete(selectedDiscount);
      refetchDiscount();
      shopify.modal.hide("delete-confirm-modal");
    }
  }, [selectedDiscount]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(discounts);

  const rowMarkup = discounts.map((discount, index) => {
    let { id, title, mode } = discount;
    return (
      <IndexTable.Row
        id={id}
        key={index}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack align="center">
            <Badge tone={mode == "ACTIVE" ? "success" : "info"}>
              {capitalizeFirstLetter(mode)}
            </Badge>
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div>
            <InlineStack align="end" gap="200">
              <Button
                onClick={() =>
                  navigate("/create-discount", {
                    state: {
                      current: JSON.stringify(discount),
                      mode: "EDIT",
                    },
                  })
                }
              >
                Edit
              </Button>
              <Button
                onClick={() =>
                  navigate("/create-discount", {
                    state: {
                      current: JSON.stringify(discount),
                    },
                  })
                }
              >
                Duplicate
              </Button>
              <Button
                onClick={() => {
                  setSelectedDiscount(id);
                  shopify.modal.show("delete-confirm-modal");
                }}
              >
                <Icon source={DeleteIcon} />
              </Button>
            </InlineStack>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const promotedBulkActions = [
    {
      content: "Capture payments",
      onAction: () => console.log("Todo: implement payment capture"),
    },
    {
      title: "Edit customers",
      actions: [
        {
          content: "Add customers",
          onAction: () => console.log("Todo: implement adding customers"),
        },
        {
          icon: DeleteIcon,
          destructive: true,
          content: "Delete customers",
          onAction: () => console.log("Todo: implement deleting customers"),
        },
      ],
    },
    {
      title: "Export",
      actions: [
        {
          content: "Export as PDF",
          onAction: () => console.log("Todo: implement PDF exporting"),
        },
        {
          content: "Export as CSV",
          onAction: () => console.log("Todo: implement CSV exporting"),
        },
      ],
    },
  ];
  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  return (
    <Box paddingBlockEnd="400">
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
                onClick={handleDeleteDiscount}
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
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={discounts.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          bulkActions={bulkActions}
          promotedBulkActions={promotedBulkActions}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Discount" },
            { title: "Status", alignment: "center" },
            { title: "Actions", alignment: "end" },
          ]}
          pagination={{
            hasNext: discounts.hasNextPage,
            onNext: () => {},
          }}
          sortable={[true]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Box>
  );
}
