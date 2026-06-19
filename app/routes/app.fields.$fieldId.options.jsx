import { useState } from "react";
import { useLoaderData, useFetcher, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  EmptyState,
  BlockStack,
  TextField,
  InlineStack,
  Button,
} from "@shopify/polaris";

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

  return { ok: true };
};

export default function FieldOptions() {
  const { field } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
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
    const form = new FormData();
    form.append("intent", "deleteOption");
    form.append("optionId", optionId);
    fetcher.submit(form, { method: "POST" });
  };

  return (
    <Page
      title={`Options for "${field.label}"`}
      backAction={{
        content: field.group.name,
        onAction: () => navigate(`/app/groups/${field.group.id}`),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="200" align="end">
                <TextField
                  label="New option"
                  value={label}
                  onChange={setLabel}
                  placeholder="e.g. Red, Blue, Large"
                  autoComplete="off"
                />
                <div style={{ paddingTop: "24px" }}>
                  <Button
                    variant="primary"
                    onClick={addOption}
                    loading={isSubmitting}
                    disabled={!label.trim()}
                  >
                    Add
                  </Button>
                </div>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card padding="0">
            {field.options.length === 0 ? (
              <EmptyState heading="No options yet">
                <p>Add options that customers can choose from.</p>
              </EmptyState>
            ) : (
              <ResourceList
                items={field.options}
                renderItem={(option) => (
                  <ResourceItem
                    id={option.id}
                    shortcutActions={[
                      {
                        content: "Delete",
                        destructive: true,
                        onAction: () => deleteOption(option.id),
                      },
                    ]}
                  >
                    <Text>{option.label}</Text>
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
