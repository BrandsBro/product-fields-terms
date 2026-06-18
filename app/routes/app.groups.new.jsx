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
} from "@shopify/polaris";

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
      backAction={{ content: "Field Groups", onAction: () => navigate("/app") }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <TextField
                label="Group name"
                value={name}
                onChange={setName}
                placeholder="e.g. Custom Engraving, Terms & Conditions"
                autoComplete="off"
              />
              <InlineStack gap="200">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={!name.trim()}
                >
                  Save
                </Button>
                <Button onClick={() => navigate("/app")}>Cancel</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
