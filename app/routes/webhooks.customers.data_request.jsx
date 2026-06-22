import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  console.log(`Webhook received: ${topic} from ${shop}`);
  // Customer data request - log it for compliance
  // In production, you would email the merchant with the customer's data
  return new Response(null, { status: 200 });
};
