import { useState, useEffect } from "react";
import { useRevalidator } from "react-router";
import { useLoaderData, useFetcher, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  Page,
  Layout,
  Card,
  Text,
  EmptyState,
  BlockStack,
  TextField,
  InlineStack,
  Button,
  Box,
  Divider,
  Icon,
  Badge,
  Banner,
} from "@shopify/polaris";
import { DragHandleIcon, DeleteIcon, PlusCircleIcon } from "@shopify/polaris-icons";

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const field = await db.field.findFirst({
    where: { id: params.fieldId },
    include: {
      options: { orderBy: { order: "asc" } },
      group: true,
    },
  });
  if (!field || field.group.shop !== shop) {
    throw new Response("Not Found", { status: 404 });
  }
  return { field };
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "addOption") {
    const count = await db.fieldOption.count({ where: { fieldId: params.fieldId } });
    await db.fieldOption.create({
      data: {
        fieldId: params.fieldId,
        label: formData.get("label"),
        order: count,
      },
    });
  }

  if (intent === "deleteOption") {
    await db.fieldOption.delete({ where: { id: formData.get("optionId") } });
  }

  if (intent === "reorder") {
    const ids = formData.getAll("ids");
    await Promise.all(
      ids.map((id, index) =>
        db.fieldOption.update({ where: { id }, data: { order: index } })
      )
    );
  }

  return { ok: true };
};

export default function FieldOptions() {
  const { field } = useLoaderData();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState(field.options);
  const [dragIndex, setDragIndex] = useState(null);
  const isSubmitting = fetcher.state === "submitting";

  // Sync options from loader data
  useEffect(() => {
    setOptions(field.options);
  }, [field.options]);

  const addOption = () => {
    if (!label.trim()) return;
    // Optimistically add to list
    const tempOption = { id: "temp-" + Date.now(), label: label.trim(), order: options.length };
    setOptions([...options, tempOption]);
    const form = new FormData();
    form.append("intent", "addOption");
    form.append("label", label.trim());
    fetcher.submit(form, { method: "POST" });
    setLabel("");
  };

  const deleteOption = (optionId) => {
    setOptions(options.filter((o) => o.id !== optionId));
    const form = new FormData();
    form.append("intent", "deleteOption");
    form.append("optionId", optionId);
    fetcher.submit(form, { method: "POST" });
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newOptions = [...options];
    const dragged = newOptions.splice(dragIndex, 1)[0];
    newOptions.splice(index, 0, dragged);
    setOptions(newOptions);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    const form = new FormData();
    form.append("intent", "reorder");
    options.forEach((o) => form.append("ids", o.id));
    fetcher.submit(form, { method: "POST" });
  };

  return (
    <Page
      title={`"${field.label}" Options`}
      subtitle={`${options.length} option${options.length !== 1 ? "s" : ""} · Drag rows to reorder`}
      backAction={{
        content: field.group.name,
        onAction: () => navigate(`/app/groups/${field.group.id}`),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="100">
                <Text variant="headingSm" fontWeight="semibold">Add new option</Text>
                <Text variant="bodySm" tone="subdued">Options appear in the dropdown on your product page.</Text>
              </BlockStack>
              <InlineStack gap="200" blockAlign="end">
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Option label"
                    labelHidden
                    value={label}
                    onChange={setLabel}
                    placeholder="e.g. Red, Blue, Large, Small..."
                    autoComplete="off"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); }}}
                  />
                </div>
                <Button
                  variant="primary"
                  icon={PlusCircleIcon}
                  onClick={addOption}
                  loading={isSubmitting}
                  disabled={!label.trim()}
                >
                  Add
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card padding="0">
            <Box
              paddingInline="400"
              paddingBlock="300"
              borderBlockEndWidth="025"
              borderColor="border"
            >
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingSm" fontWeight="semibold">
                  Options <Text as="span" tone="subdued">({options.length})</Text>
                </Text>
                {options.length > 0 && (
                  <Badge tone="info">Drag to reorder</Badge>
                )}
              </InlineStack>
            </Box>

            {options.length === 0 ? (
              <Box padding="600">
                <EmptyState heading="No options yet">
                  <p>Add options above that customers can choose from the dropdown.</p>
                </EmptyState>
              </Box>
            ) : (
              <BlockStack>
                {options.map((option, index) => (
                  <div key={option.id}>
                    <div
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      style={{
                        padding: "14px 16px",
                        background: dragIndex === index ? "#f6f6f7" : "white",
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ color: "#8c9196", display: "flex", flexShrink: 0 }}>
                        <Icon source={DragHandleIcon} />
                      </span>
                      <div style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "#f1f2f3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6d7175",
                        flexShrink: 0,
                      }}>
                        {index + 1}
                      </div>
                      <Text variant="bodyMd" as="span" style={{ flex: 1 }}>
                        {option.label}
                      </Text>
                      <Button
                        icon={DeleteIcon}
                        tone="critical"
                        variant="plain"
                        onClick={() => deleteOption(option.id)}
                        accessibilityLabel="Delete option"
                      />
                    </div>
                    {index < options.length - 1 && <Divider />}
                  </div>
                ))}
              </BlockStack>
            )}
          </Card>
        </Layout.Section>

        {options.length > 0 && (
          <Layout.Section>
            <Banner tone="success">
              <Text variant="bodySm">
                These options will appear in the dropdown on your product page. Changes are saved automatically.
              </Text>
            </Banner>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}
