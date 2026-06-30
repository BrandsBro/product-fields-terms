import db from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");
  const collectionIdsParam = url.searchParams.get("collectionIds") || "";

  if (!shop) {
    return Response.json({ fields: [] }, { status: 400 });
  }

  // Basic shop domain validation
  if (!shop.includes(".myshopify.com") && !shop.includes(".shopify.com")) {
    return Response.json({ fields: [] }, { status: 400 });
  }

  const productGid = `gid://shopify/Product/${productId}`;
  const collectionGids = collectionIdsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => `gid://shopify/Collection/${id}`);

  // Fetch all active groups for this shop; filter targeting in JS since
  // productId can hold a comma-separated list of product or collection GIDs.
  const allGroups = await db.fieldGroup.findMany({
    where: { shop, isActive: true },
    include: {
      fields: {
        include: { options: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  const groups = allGroups.filter((group) => {
    if (!group.productId) return true; // applies to all products

    const targets = group.productId.split(",").map((id) => id.trim()).filter(Boolean);
    if (targets.length === 0) return true;

    return targets.some(
      (target) => target === productGid || collectionGids.includes(target)
    );
  });

  const fields = groups.flatMap((group) => group.fields);

  return Response.json({ fields }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "public, max-age=60",
    },
  });
};
