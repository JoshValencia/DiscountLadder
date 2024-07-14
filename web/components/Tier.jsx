import { useFindFirst, useQuery, useFindMany } from "@gadgetinc/react";
import { useState, useCallback } from "react";
import { Modal } from "@shopify/app-bridge-react";
import {
  Page,
  Spinner,
  Text,
  Select,
  Button,
  BlockStack,
  TextField,
  Layout,
  InlineStack,
  Thumbnail,
  InlineGrid,
  Icon,
} from "@shopify/polaris";
import {
  StoreIcon,
  DeleteIcon,
  EditIcon,
  ExitIcon,
  XIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@shopify/polaris-icons";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

import ComboSelector from "../components/ComboSelector";
import {
  capitalizeFirstLetter,
  generateUniqueRandomString,
  TieredDiscount,
} from "../helper/generation";
import { DISCOUNT_TYPES } from "../helper/constants";

export default function Tier({
  order,
  quantity,
  title,
  subtitle,
  type,
  setTiers,
  id,
  tiers,
  discountAmount,
  modifyMode,
}) {
  const moveBackItem = () => {
    const updatedItems = tiers.map((item, index) => {
      if (order !== 1) {
        let newIndex = order - 2;
        let currentIndex = order - 1;
        if (newIndex == index) {
          return tiers[currentIndex];
        }
        if (currentIndex == index) {
          return tiers[newIndex];
        }
        return item;
      }
    });
    setTiers(updatedItems);
  };

  const moveForwardItem = () => {
    const updatedItems = tiers.map((item, index) => {
      if (order !== tiers.length) {
        let newIndex = order;
        let currentIndex = order - 1;
        if (newIndex == index) {
          return tiers[currentIndex];
        }
        if (currentIndex == index) {
          return tiers[newIndex];
        }
        return item;
      }
    });
    setTiers(updatedItems);
  };

  const updateItem = (id, key, value) => {
    const updatedItems = tiers.map((item) => {
      if (item.id === id) {
        item[key] = value;
        return item;
      }
      return item;
    });
    setTiers(updatedItems);
  };

  const deleteItem = useCallback(
    async (id) => {
      if (modifyMode == "EDIT") {
        await api.tiers.delete(id);
        const updatedItems = tiers.filter((tier) => tier.id !== id);
        setTiers(updatedItems);
        return;
      }
      const updatedItems = tiers.filter((tier) => tier.id !== id);
      setTiers(updatedItems);
    },
    [tiers]
  );

  const handleDiscountAmountChange = useCallback(
    (value) => {
      updateItem(id, "discountAmount", value);
    },
    [tiers]
  );

  const handleTypeSelectChange = useCallback(
    (value) => updateItem(id, "type", value),
    [tiers]
  );

  const typeOptions = DISCOUNT_TYPES.map((type) => ({
    label: capitalizeFirstLetter(type),
    value: type,
  }));

  const handleQuantityChange = useCallback(
    (newValue) => updateItem(id, "quantity", newValue),
    [tiers]
  );

  const handleTitleChange = useCallback(
    (newValue) => updateItem(id, "title", newValue),
    [tiers]
  );

  const handleSubTitleChange = useCallback(
    (newValue) => updateItem(id, "subtitle", newValue),
    [tiers]
  );

  const handleAddNewTier = useCallback(() => {
    setTiers((currTiers) => [
      ...currTiers,
      {
        id: generateUniqueRandomString(8),
        quantity: 0,
        title: "",
        subtitle: "",
        type: DISCOUNT_TYPES[0],
        discountAmount,
      },
    ]);
  }, [tiers]);
  return (
    <BlockStack gap="300">
      <InlineStack align="space-between">
        <Text fontWeight="bold">#{order}</Text>
        <InlineStack gap="200">
          {order !== 1 && (
            <Button
              variant="monochromePlain"
              onClick={() => moveBackItem(order - 1)}
            >
              <Icon source={ArrowUpIcon} />
            </Button>
          )}

          {tiers.length !== order && (
            <Button
              variant="monochromePlain"
              onClick={() => moveForwardItem(order - 1)}
            >
              <Icon source={ArrowDownIcon} />
            </Button>
          )}

          {tiers.length !== 1 && (
            <Button variant="monochromePlain" onClick={() => deleteItem(id)}>
              <Icon source={DeleteIcon} />
            </Button>
          )}
        </InlineStack>
      </InlineStack>
      <InlineGrid columns={["oneThird", "oneThird", "twoThirds"]} gap="200">
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          autoComplete="off"
        />
        <TextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
          autoComplete="off"
        />
        <TextField
          label="Subtitle"
          value={subtitle}
          onChange={handleSubTitleChange}
          autoComplete="off"
        />
      </InlineGrid>
      <InlineGrid
        columns={type !== "default" ? ["twoThirds", "oneThird"] : ["auto"]}
        gap="200"
      >
        <Select
          label="Type"
          options={typeOptions}
          onChange={handleTypeSelectChange}
          value={type}
        />
        {type !== "default" && (
          <TextField
            label={type == "fixed" ? "Amount" : "Percent"}
            type="number"
            value={discountAmount}
            onChange={handleDiscountAmountChange}
            prefix={type == "fixed" ? "$" : ""}
            suffix={type == "percent" ? "%" : ""}
            autoComplete="off"
            max={type == "percent" ? "100" : ""}
            min={type == "percent" ? "0" : ""}
          />
        )}
      </InlineGrid>
      {tiers.length == order && (
        <div style={{ paddingTop: "16px", borderTop: "1px solid #EBEBEB" }}>
          <Button variant="primary" fullWidth onClick={handleAddNewTier}>
            Add Tier
          </Button>
        </div>
      )}
    </BlockStack>
  );
}
