export function generateUniqueRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${result}-${Date.now()}`;
}

export function capitalizeFirstLetter(string) {
  let lowered = string.toLowerCase();
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

export function TieredDiscount(
  title,
  applies_to,
  products,
  collections,
  tiers,
  mode,
  shopId,
  modifyMode,
  id = ""
) {
  this.title = title;

  this.applies_to = applies_to;

  this.products = products;

  this.collections = collections;

  this.tiers = tiers;

  this.mode = mode;

  this.shopId = shopId;

  this.modifyMode = modifyMode;

  this.id = id == "" ? generateUniqueRandomString(8) : id;

  this.generateTitle = () => {
    return this.title == "" ? "Untitled Discount" : this.title;
  };

  this.applyDefault = () => {
    return this.applies_to == "" ? "product" : this.applies_to;
  };

  this.modeDefault = () => {
    return this.mode == "" ? "DRAFT" : this.mode;
  };

  this.checkValidity = () => {
    let response = {
      id: this.id,
      title: this.generateTitle(),
      applies_to: this.applyDefault(),
      products: this.products,
      collections: this.collections,
      tiers: this.tiers.map((t) => {
        t["discountAmount"] = parseFloat(t.discountAmount);
        t["quantity"] = parseInt(t.quantity);

        if (t.status && t.status == "OLD") {
          delete t["status"];
          delete t["__typename"];
          return {
            update: t,
          };
        } else {
          delete t["id"];
          delete t["__typename"];
          return {
            create: t,
          };
        }
      }),
      mode: this.modeDefault(),
      shopId: this.shopId,
    };
    return response;
  };
}
