import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  console.log(`Webhook received: ${topic} from ${shop}`);
  
  // Delete all shop data when merchant uninstalls
  await db.fieldGroup.deleteMany({ where: { shop } });
  await db.session.deleteMany({ where: { shop } });
  
  return new Response(null, { status: 200 });
};
