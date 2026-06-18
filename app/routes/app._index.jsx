import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Button,
  EmptyState,
  Badge,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

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

export default function Index() {
  const { groups } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page
      title="Product Fields & Terms"
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
                renderItem={(group) => (
                  <ResourceItem
                    id={group.id}
                    onClick={() => navigate(`/app/groups/${group.id}`)}
                  >
                    <BlockStack gap="100">
                      <Text fontWeight="bold">{group.name}</Text>
                      <InlineStack gap="200">
                        <Text tone="subdued">
                          {group.fields.length} field{group.fields.length !== 1 ? "s" : ""}
                        </Text>
                        <Text tone="subdued">•</Text>
                        <Text tone="subdued">
                          {group.productId ? "Specific product" : "All products"}
                        </Text>
                        <Badge tone={group.isActive ? "success" : "enabled"}>
                          {group.isActive ? "Active" : "Inactive"}
                        </Badge>
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
