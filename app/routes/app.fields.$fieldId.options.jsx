import { useState, useCallback } from "react";
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
  Icon,
  Box,
  Divider,
} from "@shopify/polaris";
import { DragHandleIcon, DeleteIcon } from "@shopify/polaris-icons";

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
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState(field.options);
  const [dragIndex, setDragIndex] = useState(null);
  const isSubmitting = fetcher.state === "submitting";

  const addOption = () => {
    if (!label.trim()) return;
    const form = new FormData();
    form.append("intent", "addOption");
    form.append("label", label);
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
      subtitle={`${options.length} option${options.length !== 1 ? "s" : ""} · Drag to reorder`}
      backAction={{
        content: field.group.name,
        onAction: () => navigate(`/app/groups/${field.group.id}`),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingSm" fontWeight="semibold">Add new option</Text>
              <InlineStack gap="200" blockAlign="end">
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Option label"
                    labelHidden
                    value={label}
                    onChange={setLabel}
                    placeholder="e.g. Red, Blue, Large"
                    autoComplete="off"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); }}}
                  />
                </div>
                <Button
                  variant="primary"
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
            {options.length === 0 ? (
              <Box padding="600">
                <EmptyState heading="No options yet">
                  <p>Add options that customers can choose from the dropdown.</p>
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
                        padding: "12px 16px",
                        background: dragIndex === index ? "#f6f6f7" : "white",
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ color: "#8c9196", display: "flex" }}>
                        <Icon source={DragHandleIcon} />
                      </span>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#f1f2f3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#6d7175",
                          flexShrink: 0,
                        }}
                      >
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
      </Layout>
    </Page>
  );
}
