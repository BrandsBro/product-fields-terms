import { useState, useEffect } from "react";
import { useLoaderData, useFetcher, useNavigate, redirect } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useAppBridge } from "@shopify/app-bridge-react";
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
  TextField,
  Select,
  Modal,
  Banner,
  Box,
  Divider,
  Icon,
  InlineGrid,
} from "@shopify/polaris";
import {
  TextIcon,
  SelectIcon,
  CheckboxIcon,
  LockIcon,
  PlusCircleIcon,
  DeleteIcon,
  ChevronRightIcon,
  EditIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request, params }) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  const group = await db.fieldGroup.findFirst({
    where: { id: params.id, shop },
    include: {
      fields: { include: { options: true }, orderBy: { order: "asc" } },
    },
  });
  if (!group) throw new Response("Not Found", { status: 404 });

  let productTitle = null;
  let collectionTitle = null;

  if (group.productId && group.productId.includes("Product")) {
    const response = await admin.graphql(
      `#graphql
      query getProduct($id: ID!) {
        product(id: $id) { title }
      }`,
      { variables: { id: group.productId } }
    );
    const data = await response.json();
    productTitle = data?.data?.product?.title || null;
  }

  if (group.productId && group.productId.includes("Collection")) {
    const response = await admin.graphql(
      `#graphql
      query getCollection($id: ID!) {
        collection(id: $id) { title }
      }`,
      { variables: { id: group.productId } }
    );
    const data = await response.json();
    collectionTitle = data?.data?.collection?.title || null;
  }

  return { group, productTitle, collectionTitle };
};

export const action = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "addField") {
    const count = await db.field.count({ where: { groupId: params.id } });
    await db.field.create({
      data: {
        groupId: params.id,
        label: formData.get("label"),
        type: formData.get("type"),
        required: false,
        placeholder: formData.get("placeholder") || null,
        order: count,
      },
    });
  }

  if (intent === "deleteField") {
    await db.field.delete({ where: { id: formData.get("fieldId") } });
  }

  if (intent === "toggleActive") {
    const group = await db.fieldGroup.findFirst({ where: { id: params.id, shop } });
    await db.fieldGroup.update({
      where: { id: params.id },
      data: { isActive: !group.isActive },
    });
  }

  if (intent === "setProduct") {
    const productId = formData.get("productId") || null;
    await db.fieldGroup.update({
      where: { id: params.id },
      data: { productId },
    });
  }

  if (intent === "deleteGroup") {
    await db.fieldGroup.delete({ where: { id: params.id } });
    return redirect("/app");
  }

  return { ok: true };
};

const FIELD_TYPES = [
  { label: "Text input", value: "TEXT" },
  { label: "Dropdown", value: "DROPDOWN" },
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "Agreement (required checkbox)", value: "AGREEMENT" },
];

const FIELD_ICONS = {
  TEXT: TextIcon,
  DROPDOWN: SelectIcon,
  CHECKBOX: CheckboxIcon,
  AGREEMENT: LockIcon,
};

const FIELD_COLORS = {
  TEXT: "#e3f2fd",
  DROPDOWN: "#e8f5e9",
  CHECKBOX: "#fce4ec",
  AGREEMENT: "#fff3e0",
};

const FIELD_TONE = {
  TEXT: "info",
  DROPDOWN: "success",
  CHECKBOX: "critical",
  AGREEMENT: "warning",
};

export default function GroupDetail() {
  const { group, productTitle, collectionTitle } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const shopify = useAppBridge();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("TEXT");
  const [placeholder, setPlaceholder] = useState("");
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.ok && fetcher.state === "idle") {
      setShowModal(false);
      setLabel("");
      setType("TEXT");
      setPlaceholder("");
    }
  }, [fetcher.data, fetcher.state]);

  const submitField = () => {
    const form = new FormData();
    form.append("intent", "addField");
    form.append("label", label);
    form.append("type", type);
    form.append("placeholder", placeholder);
    fetcher.submit(form, { method: "POST" });
  };

  const deleteField = (fieldId) => {
    const form = new FormData();
    form.append("intent", "deleteField");
    form.append("fieldId", fieldId);
    fetcher.submit(form, { method: "POST" });
  };

  const toggleActive = () => {
    const form = new FormData();
    form.append("intent", "toggleActive");
    fetcher.submit(form, { method: "POST" });
  };

  const deleteGroup = () => {
    const form = new FormData();
    form.append("intent", "deleteGroup");
    fetcher.submit(form, { method: "POST" });
  };

  const pickProduct = async () => {
    const selected = await shopify.resourcePicker({ type: "product", multiple: false });
    if (selected && selected.length > 0) {
      const form = new FormData();
      form.append("intent", "setProduct");
      form.append("productId", selected[0].id);
      fetcher.submit(form, { method: "POST" });
    }
  };

  const pickCollection = async () => {
    const selected = await shopify.resourcePicker({ type: "collection", multiple: false });
    if (selected && selected.length > 0) {
      const form = new FormData();
      form.append("intent", "setProduct");
      form.append("productId", selected[0].id);
      fetcher.submit(form, { method: "POST" });
    }
  };

  const removeProduct = () => {
    const form = new FormData();
    form.append("intent", "setProduct");
    form.append("productId", "");
    fetcher.submit(form, { method: "POST" });
  };

  return (
    <Page
      title={group.name}
      backAction={{ content: "Field Groups", onAction: () => navigate("/app") }}
      titleMetadata={
        <Badge tone={group.isActive ? "success" : "enabled"}>
          {group.isActive ? "Active" : "Inactive"}
        </Badge>
      }
      primaryAction={{
        content: "Add field",
        icon: PlusCircleIcon,
        onAction: () => setShowModal(true),
      }}
      secondaryActions={[
        {
          content: group.isActive ? "Deactivate" : "Activate",
          onAction: toggleActive,
        },
        {
          content: "Delete group",
          destructive: true,
          icon: DeleteIcon,
          onAction: () => setShowDeleteModal(true),
        },
      ]}
    >
      <Layout>
        {!group.isActive && (
          <Layout.Section>
            <Banner
              tone="warning"
              title="This group is inactive"
              action={{ content: "Activate now", onAction: toggleActive }}
            >
              Fields in this group are hidden from your storefront.
            </Banner>
          </Layout.Section>
        )}

        {/* Stats */}
        <Layout.Section>
          <InlineGrid columns={3} gap="400">
            {[
              { label: "Total Fields", value: group.fields.length, subtitle: "In this group" },
              { label: "Applies to", value: group.productId ? "1 Product" : "All", subtitle: group.productId ? "Specific product" : "All products" },
              { label: "Status", value: group.isActive ? "Active" : "Inactive", subtitle: group.isActive ? "Showing on storefront" : "Hidden from storefront" },
            ].map((stat) => (
              <Card key={stat.label}>
                <BlockStack gap="100">
                  <Text variant="bodySm" tone="subdued">{stat.label}</Text>
                  <Text variant="headingLg" fontWeight="bold">{stat.value}</Text>
                  <Text variant="bodySm" tone="subdued">{stat.subtitle}</Text>
                </BlockStack>
              </Card>
            ))}
          </InlineGrid>
        </Layout.Section>

        {/* Product Targeting */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text variant="headingSm" fontWeight="semibold">Product targeting</Text>
                  <Text variant="bodySm" tone="subdued">Choose which products show these fields.</Text>
                </BlockStack>

              </InlineStack>
              <Divider />
              {group.productId ? (
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone={group.productId.includes("Collection") ? "warning" : "info"}>
                      {group.productId.includes("Collection") ? "Collection" : "Product"}
                    </Badge>
                    <Text variant="bodyMd" fontWeight="semibold">
                      {productTitle || collectionTitle || group.productId}
                    </Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    {group.productId.includes("Collection") ? (
                      <Button size="slim" onClick={pickCollection}>Change collection</Button>
                    ) : (
                      <Button size="slim" onClick={pickProduct}>Change product</Button>
                    )}
                    <Button size="slim" tone="critical" onClick={removeProduct}>Remove — show on all</Button>
                  </InlineStack>
                </InlineStack>
              ) : (
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone="success">All products</Badge>
                    <Text variant="bodySm" tone="subdued">Fields show on every product page</Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Button size="slim" onClick={pickProduct}>Limit to specific product</Button>
                    <Button size="slim" onClick={pickCollection}>Limit to collection</Button>
                  </InlineStack>
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Fields */}
        <Layout.Section>
          <Card padding="0">
            <Box
              paddingInline="400"
              paddingBlock="300"
              borderBlockEndWidth="025"
              borderColor="border"
            >
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text variant="headingSm" fontWeight="semibold">Fields</Text>
                  <Text variant="bodySm" tone="subdued">
                    {group.fields.length} field{group.fields.length !== 1 ? "s" : ""} — shown in order below
                  </Text>
                </BlockStack>
                <Button
                  variant="primary"
                  icon={PlusCircleIcon}
                  onClick={() => setShowModal(true)}
                  size="slim"
                >
                  Add field
                </Button>
              </InlineStack>
            </Box>

            {group.fields.length === 0 ? (
              <Box padding="800">
                <EmptyState
                  heading="No fields yet"
                  action={{
                    content: "Add your first field",
                    onAction: () => setShowModal(true),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Add text inputs, dropdowns, checkboxes, or agreement fields to collect information from customers.</p>
                </EmptyState>
              </Box>
            ) : (
              <BlockStack>
                {group.fields.map((field, index) => (
                  <div key={field.id}>
                    <Box paddingInline="400" paddingBlock="300">
                      <InlineStack align="space-between" blockAlign="center" wrap={false}>
                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                          <div style={{
                            background: FIELD_COLORS[field.type],
                            borderRadius: "8px",
                            padding: "8px",
                            display: "flex",
                            flexShrink: 0,
                          }}>
                            <Icon source={FIELD_ICONS[field.type]} />
                          </div>
                          <BlockStack gap="050">
                            <Text variant="bodyMd" fontWeight="semibold">{field.label}</Text>
                            <InlineStack gap="200">
                              <Badge tone={FIELD_TONE[field.type]}>
                                {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                              </Badge>
                              {field.type === "DROPDOWN" && (
                                <Text variant="bodySm" tone="subdued">
                                  {field.options.length} option{field.options.length !== 1 ? "s" : ""}
                                </Text>
                              )}
                            </InlineStack>
                          </BlockStack>
                        </InlineStack>
                        <InlineStack gap="200">
                          {field.type === "DROPDOWN" && (
                            <Button
                              size="slim"
                              icon={EditIcon}
                              onClick={() => navigate(`/app/fields/${field.id}/options`)}
                            >
                              Options
                            </Button>
                          )}
                          <Button
                            size="slim"
                            icon={DeleteIcon}
                            tone="critical"
                            onClick={() => deleteField(field.id)}
                          />
                        </InlineStack>
                      </InlineStack>
                    </Box>
                    {index < group.fields.length - 1 && <Divider />}
                  </div>
                ))}
              </BlockStack>
            )}
          </Card>
        </Layout.Section>
      </Layout>

      {/* Add Field Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add field"
        primaryAction={{
          content: "Save field",
          onAction: submitField,
          loading: isSubmitting,
          disabled: !label.trim(),
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowModal(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Field label"
              value={label}
              onChange={setLabel}
              placeholder="e.g. Engraving text, Gift message"
              autoComplete="off"
              helpText="This is what customers will see on the product page."
              autoFocus
            />
            <Select
              label="Field type"
              options={FIELD_TYPES}
              value={type}
              onChange={setType}
              helpText="Choose the type of input you want customers to fill in."
            />
            {type === "TEXT" && (
              <TextField
                label="Placeholder text (optional)"
                value={placeholder}
                onChange={setPlaceholder}
                placeholder="e.g. Enter your text here..."
                autoComplete="off"
                helpText="Hint text shown inside the input field."
              />
            )}
            {type === "DROPDOWN" && (
              <Banner tone="info">
                After saving, you can add options to this dropdown field.
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Delete Group Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete field group"
        primaryAction={{
          content: "Delete group",
          destructive: true,
          onAction: deleteGroup,
          loading: isSubmitting,
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowDeleteModal(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text>Are you sure you want to delete <Text as="span" fontWeight="bold">"{group.name}"</Text>?</Text>
            <Text tone="subdued">This will permanently delete the group and all {group.fields.length} field{group.fields.length !== 1 ? "s" : ""} inside it. This action cannot be undone.</Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
