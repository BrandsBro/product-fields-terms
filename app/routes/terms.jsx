export default function Terms() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Terms of Service — Product Fields & Terms</title>
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
          <a href="/" className="nav-logo">Product Fields & Terms</a>
        </nav>
        <div className="content">
          <h1>Terms of Service</h1>
          <p className="updated">Last updated: June 22, 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By installing and using Product Fields & Terms, you agree to be bound by these Terms of Service.</p>

          <h2>2. Description of Service</h2>
          <p>Product Fields & Terms is a Shopify application that allows merchants to add custom fields to their product pages and collect customer information at checkout.</p>

          <h2>3. Use of Service</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with Shopify's Partner Program Agreement and API Terms of Service.</p>

          <h2>4. Data Responsibility</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>The content of fields you create</li>
            <li>Obtaining necessary consent from your customers</li>
            <li>Complying with applicable data protection laws</li>
          </ul>

          <h2>5. Limitation of Liability</h2>
          <p>Product Fields & Terms is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service.</p>

          <h2>6. Termination</h2>
          <p>We reserve the right to terminate access to our service for violations of these terms. You may terminate by uninstalling the app from your Shopify store.</p>

          <h2>7. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.</p>

          <h2>8. Contact</h2>
          <p>For questions about these terms, contact us at: <strong>support@productfieldsandterms.com</strong></p>
        </div>
        <footer>
          <p>© 2026 Product Fields & Terms. <a href="/">Home</a> · <a href="/privacy">Privacy Policy</a></p>
        </footer>
      </body>
    </html>
  );
}
