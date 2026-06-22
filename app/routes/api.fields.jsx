import db from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  if (!shop) {
    return Response.json({ fields: [] }, { status: 400 });
  }

  // Basic shop domain validation
  if (!shop.includes(".myshopify.com") && !shop.includes(".shopify.com")) {
    return Response.json({ fields: [] }, { status: 400 });
  }

  const productGid = `gid://shopify/Product/${productId}`;

  const groups = await db.fieldGroup.findMany({
    where: {
      shop,
      isActive: true,
      OR: [
        { productId: null },
        { productId: productGid },
      ],
    },
    include: {
      fields: {
        include: { options: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
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
