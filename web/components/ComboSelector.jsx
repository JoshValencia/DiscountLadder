import { useFindMany } from "@gadgetinc/react";
import { useState, useCallback, useMemo } from "react";
import { Listbox, Combobox, InlineGrid, Button, Icon } from "@shopify/polaris";
import { api } from "../api";
import { SearchIcon } from "@shopify/polaris-icons";

export default function ComboSelector({
  inputValue,
  setInputValue,
  fireResourcePicker,
  selectedResource,
  selectedProducts,
  selectedCollections,
  setSelectedProducts,
  setSelectedCollections,
}) {
  const updateText = useCallback(async (value) => {
    setInputValue(value);
    await fireResourcePicker(
      selectedResource,
      value,
      selectedProducts,
      selectedCollections,
      setSelectedProducts,
      setSelectedCollections,
      shopify
    );
  }, []);

  let label = `Search ${selectedResource}`;

  return (
    <div style={{ height: "auto" }}>
      <InlineGrid gap="100">
        <Combobox
          activator={
            <Combobox.TextField
              prefix={<Icon source={SearchIcon} />}
              onChange={updateText}
              label={label}
              labelHidden
              value={inputValue}
              placeholder={label}
              autoComplete="off"
            />
          }
        ></Combobox>
      </InlineGrid>
    </div>
  );
}
