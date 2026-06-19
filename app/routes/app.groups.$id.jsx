import { useState, useEffect } from "react";
import { useLoaderData, useFetcher, useNavigate, redirect } from "react-router";
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
  TextField,
  Select,
  Checkbox,
  Banner,
  Modal,
} from "@shopify/polaris";

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const group = await db.fieldGroup.findFirst({
    where: { id: params.id, shop },
    include: {
      fields: { include: { options: true }, orderBy: { order: "asc" } },
    },
  });

  if (!group) throw new Response("Not Found", { status: 404 });
  return { group };
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
        required: formData.get("required") === "true",
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

export default function GroupDetail() {
  const { group } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
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
      setRequired(false);
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

  return (
    <Page
      title={group.name}
      backAction={{ content: "Field Groups", onAction: () => navigate("/app") }}
      primaryAction={{
        content: "Add field",
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
          onAction: () => setShowDeleteModal(true),
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          {!group.isActive && (
            <Banner tone="warning" title="This group is inactive">
              Fields in this group will not be shown on the storefront.
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card padding="0">
            {group.fields.length === 0 ? (
              <EmptyState
                heading="No fields yet"
                action={{ content: "Add field", onAction: () => setShowModal(true) }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Add your first field to this group.</p>
              </EmptyState>
            ) : (
              <ResourceList
                items={group.fields}
                renderItem={(field) => (
                  <ResourceItem
                    id={field.id}
                    shortcutActions={[
                      {
                        content: "Delete",
                        destructive: true,
                        onAction: () => deleteField(field.id),
                      },
                    ]}
                  >
                    <BlockStack gap="100">
                      <Text fontWeight="bold">{field.label}</Text>
                      <InlineStack gap="200">
                        <Text tone="subdued">
                          {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                        </Text>
                        <Badge tone={field.required ? "attention" : "enabled"}>
                          {field.required ? "Required" : "Optional"}
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

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add field"
        primaryAction={{
          content: "Save field",
          onAction: submitField,
          loading: isSubmitting,
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowModal(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Field label"
              value={label}
              onChange={setLabel}
              placeholder="e.g. Engraving text"
              autoComplete="off"
            />
            <Select
              label="Field type"
              options={FIELD_TYPES}
              value={type}
              onChange={setType}
            />
            {type === "TEXT" && (
              <TextField
                label="Placeholder (optional)"
                value={placeholder}
                onChange={setPlaceholder}
                autoComplete="off"
              />
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete field group"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: deleteGroup,
          loading: isSubmitting,
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowDeleteModal(false) }]}
      >
        <Modal.Section>
          <Text>Are you sure you want to delete "{group.name}"? This will also delete all fields in this group. This action cannot be undone.</Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
