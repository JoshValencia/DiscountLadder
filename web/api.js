// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/discount-ladder
import { Client } from "@gadget-client/discount-ladder";

export const api = new Client({ environment: window.gadgetConfig.environment });
