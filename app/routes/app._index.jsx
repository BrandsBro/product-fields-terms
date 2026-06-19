import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  EmptyState,
  Badge,
  InlineStack,
  BlockStack,
  Button,
  Box,
  InlineGrid,
  Icon,
  Divider,
  Checkbox,
  Banner,
} from "@shopify/polaris";
import {
  ListBulletedIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  NoteIcon,
  ProductIcon,
  OrderIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";

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
    await db.fieldGroup.deleteMany({ where: { id: { in: ids }, shop } });
  }
  return { ok: true };
};

function StatCard({ label, value, subtitle, icon, bgColor, iconColor }) {
  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="start">
          <BlockStack gap="050">
            <Text variant="bodySm" tone="subdued">{label}</Text>
            <Text variant="heading2xl" as="p" fontWeight="bold">{value}</Text>
          </BlockStack>
          <div style={{
            background: bgColor,
            borderRadius: "10px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Icon source={icon} tone={iconColor} />
          </div>
        </InlineStack>
        <Text variant="bodySm" tone="subdued">{subtitle}</Text>
      </BlockStack>
    </Card>
  );
}

export default function Index() {
  const { groups } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [selected, setSelected] = useState([]);

  const totalFields = groups.reduce((acc, g) => acc + g.fields.length, 0);
  const activeGroups = groups.filter((g) => g.isActive).length;
  const inactiveGroups = groups.filter((g) => !g.isActive).length;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === groups.length ? [] : groups.map((g) => g.id));
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} group(s)? This cannot be undone.`)) return;
    const form = new FormData();
    form.append("intent", "bulkDelete");
    selected.forEach((id) => form.append("ids", id));
    fetcher.submit(form, { method: "POST" });
    setSelected([]);
  };

  return (
    <Page
      title="Product Fields & Terms"
      subtitle="Collect custom information from customers on your product pages"
      primaryAction={{
        content: "Create field group",
        icon: PlusCircleIcon,
        onAction: () => navigate("/app/groups/new"),
      }}
    >
      <Layout>
        {/* Stats */}
        <Layout.Section>
          <InlineGrid columns={3} gap="400">
            <StatCard
              label="Total Groups"
              value={groups.length}
              subtitle={`${totalFields} field${totalFields !== 1 ? "s" : ""} configured`}
              icon={ListBulletedIcon}
              bgColor="#f0f0f0"
              iconColor="base"
            />
            <StatCard
              label="Active Groups"
              value={activeGroups}
              subtitle="Showing on your storefront"
              icon={CheckCircleIcon}
              bgColor="#e3f9e5"
              iconColor="success"
            />
            <StatCard
              label="Inactive Groups"
              value={inactiveGroups}
              subtitle="Hidden from storefront"
              icon={XCircleIcon}
              bgColor="#fff4f4"
              iconColor="critical"
            />
          </InlineGrid>
        </Layout.Section>

        {/* Bulk action banner */}
        {selected.length > 0 && (
          <Layout.Section>
            <Banner tone="warning">
              <InlineStack align="space-between" blockAlign="center">
                <Text>{selected.length} group{selected.length !== 1 ? "s" : ""} selected</Text>
                <Button
                  tone="critical"
                  icon={DeleteIcon}
                  onClick={handleBulkDelete}
                  size="slim"
                >
                  Delete selected
                </Button>
              </InlineStack>
            </Banner>
          </Layout.Section>
        )}

        {/* Field Groups */}
        <Layout.Section>
          <Card padding="0">
            {/* Header */}
            <Box
              paddingInline="400"
              paddingBlock="300"
              borderBlockEndWidth="025"
              borderColor="border"
            >
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                  {groups.length > 0 && (
                    <Checkbox
                      label=""
                      labelHidden
                      checked={selected.length === groups.length && groups.length > 0}
                      onChange={toggleAll}
                    />
                  )}
                  <Text variant="headingSm" fontWeight="semibold">
                    Field Groups {groups.length > 0 && <Text as="span" tone="subdued">({groups.length})</Text>}
                  </Text>
                </InlineStack>
                <Button
                  variant="plain"
                  icon={PlusCircleIcon}
                  onClick={() => navigate("/app/groups/new")}
                >
                  New group
                </Button>
              </InlineStack>
            </Box>

            {groups.length === 0 ? (
              <Box padding="800">
                <EmptyState
                  heading="No field groups yet"
                  action={{
                    content: "Create your first group",
                    onAction: () => navigate("/app/groups/new"),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Field groups let you add custom inputs like engraving text, gift options, or agreement checkboxes to your product pages.</p>
                </EmptyState>
              </Box>
            ) : (
              <BlockStack>
                {groups.map((group, index) => (
                  <div key={group.id}>
                    <Box
                      paddingInline="400"
                      paddingBlock="300"
                      background={selected.includes(group.id) ? "bg-surface-selected" : undefined}
                    >
                      <InlineStack align="space-between" blockAlign="center" wrap={false}>
                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                          <Checkbox
                            label=""
                            labelHidden
                            checked={selected.includes(group.id)}
                            onChange={() => toggleSelect(group.id)}
                          />
                          <div
                            style={{
                              background: group.isActive ? "#e3f9e5" : "#f0f0f0",
                              borderRadius: "8px",
                              padding: "8px",
                              display: "flex",
                              flexShrink: 0,
                            }}
                          >
                            <Icon
                              source={ListBulletedIcon}
                              tone={group.isActive ? "success" : "subdued"}
                            />
                          </div>
                          <BlockStack gap="050">
                            <InlineStack gap="200" blockAlign="center">
                              <Text variant="bodyMd" fontWeight="semibold">{group.name}</Text>
                              <Badge tone={group.isActive ? "success" : "enabled"}>
                                {group.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </InlineStack>
                            <Text tone="subdued" variant="bodySm">
                              {group.fields.length} field{group.fields.length !== 1 ? "s" : ""} &nbsp;·&nbsp; {group.productId ? "Specific product" : "All products"}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                        <Button
                          variant="plain"
                          icon={ChevronRightIcon}
                          onClick={() => navigate(`/app/groups/${group.id}`)}
                          accessibilityLabel={`Manage ${group.name}`}
                        />
                      </InlineStack>
                    </Box>
                    {index < groups.length - 1 && <Divider />}
                  </div>
                ))}
              </BlockStack>
            )}
          </Card>
        </Layout.Section>

        {/* How it works */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="050">
                <Text variant="headingSm" fontWeight="semibold">How it works</Text>
                <Text variant="bodySm" tone="subdued">Set up custom fields for your products in 3 easy steps</Text>
              </BlockStack>
              <Divider />
              <InlineGrid columns={3} gap="500">
                {[
                  {
                    num: "1",
                    icon: NoteIcon,
                    title: "Create a field group",
                    desc: "Give your group a name and choose which products it applies to.",
                    color: "#e8f5e9",
                  },
                  {
                    num: "2",
                    icon: ProductIcon,
                    title: "Add custom fields",
                    desc: "Add text inputs, dropdowns, checkboxes, or agreement fields.",
                    color: "#e3f2fd",
                  },
                  {
                    num: "3",
                    icon: OrderIcon,
                    title: "See it in orders",
                    desc: "Customer answers appear as line item properties in every order.",
                    color: "#fce4ec",
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    style={{
                      background: step.color,
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <BlockStack gap="300">
                      <div style={{
                        background: "white",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}>
                        {step.num}
                      </div>
                      <BlockStack gap="100">
                        <Text variant="bodyMd" fontWeight="semibold">{step.title}</Text>
                        <Text variant="bodySm" tone="subdued">{step.desc}</Text>
                      </BlockStack>
                    </BlockStack>
                  </div>
                ))}
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
