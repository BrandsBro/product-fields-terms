import { Page, Layout, Card, BlockStack, Text, Divider, InlineStack, Icon, Badge } from "@shopify/polaris";
import { CheckCircleIcon } from "@shopify/polaris-icons";

export default function Settings() {
  return (
    <Page
      title="Settings"
      subtitle="Configure your Product Options & Terms app"
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" fontWeight="semibold">Theme App Block</Text>
              <Text variant="bodySm" tone="subdued">
                To show fields on your product page, you need to add the Product Options block to your theme.
              </Text>
              <Divider />
              <BlockStack gap="300">
                {[
                  "Go to Online Store → Themes",
                  "Click Customize on your active theme",
                  "Navigate to a Product page",
                  'Click "Add block" and find Product Options under Apps',
                  "Set the App URL and save",
                ].map((step, i) => (
                  <InlineStack key={i} gap="200" blockAlign="center">
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#e3f9e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <Text variant="bodySm">{step}</Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" fontWeight="semibold">App Information</Text>
              <Divider />
              <BlockStack gap="200">
                {[
                  { label: "App name", value: "Product Options & Terms" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Status", value: <Badge tone="success">Active</Badge> },
                ].map((item) => (
                  <InlineStack key={item.label} align="space-between">
                    <Text variant="bodySm" tone="subdued">{item.label}</Text>
                    <Text variant="bodySm">{item.value}</Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
