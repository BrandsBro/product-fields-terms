import { useState, useEffect } from "react";
import { useNavigate, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Box,
  InlineGrid,
  Icon,
  Divider,
  Badge,
} from "@shopify/polaris";
import {
  NoteIcon,
  ProductIcon,
  GlobeIcon,
} from "@shopify/polaris-icons";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const name = formData.get("name");
  const productId = formData.get("productId") || null;
  const group = await db.fieldGroup.create({
    data: { shop, name, productId },
  });
  return { group };
};

const EXAMPLES = [
  { label: "Custom Engraving", desc: "Collect engraving text from customers" },
  { label: "Gift Options", desc: "Let customers add gift wrap or messages" },
  { label: "Terms & Conditions", desc: "Require customers to agree before purchase" },
  { label: "Size & Fit Info", desc: "Collect measurements or preferences" },
];

export default function NewGroup() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const isLoading = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.group?.id) {
      navigate(`/app/groups/${fetcher.data.group.id}`);
    }
  }, [fetcher.data]);

  const handleSave = () => {
    const form = new FormData();
    form.append("name", name);
    fetcher.submit(form, { method: "POST", action: "/app/groups/new" });
  };

  return (
    <Page
      title="Create field group"
      subtitle="A field group contains one or more custom fields shown on your product page"
      backAction={{ content: "Field Groups", onAction: () => navigate("/app") }}
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" fontWeight="semibold">What is a field group?</Text>
                <Text variant="bodySm" tone="subdued">
                  A field group is a collection of custom inputs shown to customers on your product page. You can have multiple groups for different use cases.
                </Text>
                <Divider />
                <BlockStack gap="200">
                  {[
                    { icon: NoteIcon, text: "Shown above the Add to Cart button" },
                    { icon: ProductIcon, text: "Can be assigned to all or specific products" },
                    { icon: GlobeIcon, text: "Responses saved as line item properties" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex", flexShrink: 0 }}>
                        <Icon source={item.icon} tone="subdued" />
                      </div>
                      <Text variant="bodySm" tone="subdued">{item.text}</Text>
                    </div>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" fontWeight="semibold">Examples</Text>
                <BlockStack gap="200">
                  {EXAMPLES.map((ex) => (
                    <div
                      key={ex.label}
                      onClick={() => setName(ex.label)}
                      style={{
                        background: "#f6f6f7",
                        borderRadius: "8px",
                        padding: "12px",
                        cursor: "pointer",
                        border: name === ex.label ? "2px solid #008060" : "2px solid transparent",
                      }}
                    >
                      <BlockStack gap="050">
                        <Text variant="bodySm" fontWeight="semibold">{ex.label}</Text>
                        <Text variant="bodySm" tone="subdued">{ex.desc}</Text>
                      </BlockStack>
                    </div>
                  ))}
                </BlockStack>
                <Text variant="bodySm" tone="subdued">Click an example to use it as your group name.</Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <BlockStack gap="100">
                <Text variant="headingSm" fontWeight="semibold">Group details</Text>
                <Text variant="bodySm" tone="subdued">Give your field group a clear, descriptive name.</Text>
              </BlockStack>
              <Divider />
              <TextField
                label="Group name"
                value={name}
                onChange={setName}
                placeholder="e.g. Custom Engraving, Terms & Conditions"
                autoComplete="off"
                autoFocus
                helpText="This name is for your reference only — customers won't see it."
              />
              <Box
                background="bg-surface-secondary"
                borderRadius="200"
                padding="400"
              >
                <BlockStack gap="200">
                  <Text variant="bodySm" fontWeight="semibold">After saving you can:</Text>
                  <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued">• Add text inputs, dropdowns, checkboxes, and agreement fields</Text>
                    <Text variant="bodySm" tone="subdued">• Add options to dropdown fields</Text>
                    <Text variant="bodySm" tone="subdued">• Activate or deactivate the group anytime</Text>
                  </BlockStack>
                </BlockStack>
              </Box>
              <InlineStack gap="200">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={!name.trim()}
                  size="large"
                >
                  Save and add fields
                </Button>
                <Button onClick={() => navigate("/app")} size="large">
                  Cancel
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
