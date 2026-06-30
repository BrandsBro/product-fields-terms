export default function Privacy() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Privacy Policy — Product Options and Terms</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; }
          .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 60px; border-bottom: 1px solid #eee; }
          .nav-logo { font-size: 20px; font-weight: 700; color: #1a1a1a; text-decoration: none; }
          .content { max-width: 800px; margin: 60px auto; padding: 0 24px; }
          h1 { font-size: 40px; font-weight: 700; margin-bottom: 8px; }
          .updated { color: #555; margin-bottom: 40px; }
          h2 { font-size: 24px; font-weight: 700; margin: 40px 0 16px; }
          p { color: #374151; line-height: 1.8; margin-bottom: 16px; }
          ul { color: #374151; line-height: 1.8; margin: 0 0 16px 24px; }
          footer { text-align: center; padding: 40px; color: #999; font-size: 14px; border-top: 1px solid #eee; margin-top: 60px; }
        `}</style>
      </head>
      <body>
        <nav className="nav">
          <a href="/" className="nav-logo">Product Options and Terms</a>
        </nav>
        <div className="content">
          <h1>Privacy Policy</h1>
          <p className="updated">Last updated: June 22, 2026</p>

          <h2>1. Introduction</h2>
          <p>Product Options and Terms ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our Shopify application.</p>

          <h2>2. Information We Collect</h2>
          <p>When you install our app, we collect:</p>
          <ul>
            <li>Shop domain and basic store information</li>
            <li>Access tokens required to operate the app</li>
            <li>Field group configurations you create</li>
          </ul>
          <p>We do NOT collect or store personal customer data. Customer responses to custom fields are stored directly in Shopify as line item properties and are not stored in our systems.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our app functionality</li>
            <li>Store your field group configurations</li>
            <li>Authenticate your Shopify store</li>
          </ul>

          <h2>4. Data Storage</h2>
          <p>Your field group configurations are stored securely in our database hosted on Supabase (PostgreSQL). We use industry-standard security measures to protect your data.</p>

          <h2>5. Data Sharing</h2>
          <p>We do not sell, trade, or share your data with third parties except as required to operate the service (e.g., hosting providers).</p>

          <h2>6. Data Deletion</h2>
          <p>When you uninstall our app, all your data including field groups and configurations are automatically deleted from our systems within 48 hours.</p>

          <h2>7. GDPR Compliance</h2>
          <p>We comply with GDPR requirements. Upon request, we will provide, correct, or delete any personal data we hold about you. Contact us at the email below.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: <strong>brandsbrollc@gmail.com</strong></p>
        </div>
        <footer>
          <p>© 2026 Product Options and Terms. <a href="/">Home</a> · <a href="/terms">Terms of Service</a></p>
        </footer>
      </body>
    </html>
  );
}
