import { Page, Layout, Card, BlockStack, Text, Divider, InlineStack, Icon, Box } from "@shopify/polaris";
import { QuestionCircleIcon, ChatIcon, EmailIcon } from "@shopify/polaris-icons";

const FAQS = [
  {
    q: "How do I show fields on my product page?",
    a: "Go to Online Store → Themes → Customize → Product page → Add block → find 'Product Options' under Apps section.",
  },
  {
    q: "Where do I see customer responses?",
    a: "Customer responses are saved as line item properties. Go to Orders → click any order → you'll see the responses under each line item.",
  },
  {
    q: "Can I assign fields to specific products only?",
    a: "Yes! When creating a field group, you can choose to apply it to all products or a specific product by entering the product ID.",
  },
  {
    q: "How do I add options to a dropdown field?",
    a: "Go to your field group → click on the dropdown field → click 'Options' → add your options there.",
  },
  {
    q: "Can I temporarily hide fields without deleting them?",
    a: "Yes! Use the Deactivate button on your field group to hide it from the storefront without deleting it.",
  },
  {
    q: "Why are my fields not showing on the product page?",
    a: "Make sure: 1) The field group is Active, 2) The theme block is added to your product page template, 3) The App URL in the block settings is correct.",
  },
];

export default function Help() {
  return (
    <Page
      title="Help & Support"
      subtitle="Everything you need to get started with Product Options & Terms"
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" fontWeight="semibold">Frequently Asked Questions</Text>
              <Divider />
              <BlockStack gap="400">
                {FAQS.map((faq, i) => (
                  <div key={i}>
                    <BlockStack gap="150">
                      <Text variant="bodyMd" fontWeight="semibold">{faq.q}</Text>
                      <Text variant="bodySm" tone="subdued">{faq.a}</Text>
                    </BlockStack>
                    {i < FAQS.length - 1 && <Box paddingBlockStart="400"><Divider /></Box>}
                  </div>
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" fontWeight="semibold">Quick Start Guide</Text>
                <Divider />
                <BlockStack gap="200">
                  {[
                    "Create a field group",
                    "Add fields to the group",
                    "Add dropdown options if needed",
                    "Add the theme block to your product page",
                    "Test on your storefront",
                    "Check responses in Orders",
                  ].map((step, i) => (
                    <InlineStack key={i} gap="200" blockAlign="center">
                      <div style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "700",
                        flexShrink: 0,
                        color: "#1565c0",
                      }}>
                        {i + 1}
                      </div>
                      <Text variant="bodySm">{step}</Text>
                    </InlineStack>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" fontWeight="semibold">Field Types</Text>
                <Divider />
                <BlockStack gap="200">
                  {[
                    { type: "Text input", desc: "Free text entry", color: "#e3f2fd" },
                    { type: "Dropdown", desc: "Select from options", color: "#e8f5e9" },
                    { type: "Checkbox", desc: "Yes/No toggle", color: "#fce4ec" },
                    { type: "Agreement", desc: "Required consent checkbox", color: "#fff3e0" },
                  ].map((item) => (
                    <InlineStack key={item.type} gap="200" blockAlign="center">
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: item.color,
                        border: "2px solid #ccc",
                        flexShrink: 0,
                      }} />
                      <Text variant="bodySm" fontWeight="semibold">{item.type}</Text>
                      <Text variant="bodySm" tone="subdued">— {item.desc}</Text>
                    </InlineStack>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
