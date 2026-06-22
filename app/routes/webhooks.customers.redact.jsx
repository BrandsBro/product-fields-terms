import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  console.log(`Webhook received: ${topic} from ${shop}`);
  // Customer redact - we don't store personal customer data
  // Line item properties are stored in Shopify, not our DB
  return new Response(null, { status: 200 });
};
