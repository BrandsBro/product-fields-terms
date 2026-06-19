import { useLoaderData, useNavigate, useFetcher, useRevalidator } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  EmptyState,
  Badge,
  InlineStack,
  BlockStack,
  Thumbnail,
} from "@shopify/polaris";
import { CollectionIcon } from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const groups = await db.fieldGroup.findMany({
    where: { shop },
    include: { fields: true },
    orderBy: { createdAt: "desc" },
  });
  return { groups };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "bulkDelete") {
    const ids = formData.getAll("ids");
    await db.fieldGroup.deleteMany({
      where: { id: { in: ids }, shop },
    });
  }
  return { ok: true };
};

export default function Index() {
  const { groups } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const form = new FormData();
    form.append("intent", "bulkDelete");
    selectedItems.forEach((id) => form.append("ids", id));
    fetcher.submit(form, { method: "POST" });
    setSelectedItems([]);
  };

  return (
    <Page
      title="Product Fields & Terms"
      subtitle="Manage custom fields shown on your product pages"
      primaryAction={{
        content: "Create field group",
        onAction: () => navigate("/app/groups/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {groups.length === 0 ? (
              <EmptyState
                heading="No field groups yet"
                action={{
                  content: "Create field group",
                  onAction: () => navigate("/app/groups/new"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Create your first field group to start adding custom fields to your products.</p>
              </EmptyState>
            ) : (
              <ResourceList
                items={groups}
                selectable
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                promotedBulkActions={[
                  {
                    content: `Delete ${selectedItems.length} selected`,
                    destructive: true,
                    onAction: handleBulkDelete,
                  },
                ]}
                renderItem={(group) => (
                  <ResourceItem
                    id={group.id}
                    onClick={() => navigate(`/app/groups/${group.id}`)}
                    media={
                      <Thumbnail
                        source={CollectionIcon}
                        size="small"
                        alt={group.name}
                      />
                    }
                  >
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text variant="bodyMd" fontWeight="bold">{group.name}</Text>
                        <Badge tone={group.isActive ? "success" : "enabled"}>
                          {group.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </InlineStack>
                      <InlineStack gap="200">
                        <Text tone="subdued" variant="bodySm">
                          {group.fields.length} field{group.fields.length !== 1 ? "s" : ""}
                        </Text>
                        <Text tone="subdued" variant="bodySm">•</Text>
                        <Text tone="subdued" variant="bodySm">
                          {group.productId ? "Specific product" : "All products"}
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </ResourceItem>
                )}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
