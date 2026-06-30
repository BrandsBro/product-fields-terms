import { useState } from "react";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Support — Product Options and Terms</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; }
          .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 60px; border-bottom: 1px solid #eee; }
          .nav-logo { font-size: 20px; font-weight: 700; color: #1a1a1a; text-decoration: none; }
          .hero { padding: 60px; text-align: center; background: #f9fafb; }
          .hero h1 { font-size: 40px; font-weight: 700; margin-bottom: 16px; }
          .hero p { color: #555; font-size: 18px; }
          .content { max-width: 800px; margin: 60px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .card { padding: 32px; border-radius: 16px; border: 1px solid #eee; }
          .card h2 { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
          .card p { color: #555; line-height: 1.8; margin-bottom: 16px; }
          .card a { color: #008060; font-weight: 600; text-decoration: none; }
          input, textarea, select { width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; margin-bottom: 16px; font-family: inherit; }
          textarea { height: 120px; resize: vertical; }
          label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
          .btn { padding: 12px 24px; background: #008060; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; }
          .success { background: #dcfce7; color: #166534; padding: 16px; border-radius: 8px; text-align: center; font-weight: 600; }
          footer { text-align: center; padding: 40px; color: #999; font-size: 14px; border-top: 1px solid #eee; margin-top: 60px; }
          @media (max-width: 768px) {
            .nav { padding: 16px 24px; }
            .hero { padding: 40px 24px; }
            .content { grid-template-columns: 1fr; }
          }
        `}</style>
      </head>
      <body>
        <nav className="nav">
          <a href="/" className="nav-logo">Product Options and Terms</a>
        </nav>

        <div className="hero">
          <h1>How can we help?</h1>
          <p>Get support from our team or browse common questions</p>
        </div>

        <div className="content">
          <div>
            <div className="card">
              <h2>Contact us</h2>
              {submitted ? (
                <div className="success">✓ Message sent! We'll get back to you within 24 hours.</div>
              ) : (
                <div>
                  <div>
                    <label>Your name</label>
                    <input type="text" placeholder="John Smith" />
                  </div>
                  <div>
                    <label>Email address</label>
                    <input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label>Shop domain</label>
                    <input type="text" placeholder="my-store.myshopify.com" />
                  </div>
                  <div>
                    <label>Message</label>
                    <textarea placeholder="Describe your issue..." />
                  </div>
                  <button className="btn" onClick={() => setSubmitted(true)}>Send message</button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card">
              <h2>Quick answers</h2>
              {[
                { q: "How do I add fields to my product page?", a: "Go to Online Store → Themes → Customize → Product page → Add block → find 'Product Options' under Apps." },
                { q: "Where do I see customer responses?", a: "Go to Orders → click any order → responses appear under each line item." },
                { q: "Can I assign fields to specific products?", a: "Yes! Inside each field group, use the Product targeting section to assign to specific products or collections." },
                { q: "How do I add dropdown options?", a: "Open a field group → click on a dropdown field → click Options to add choices." },
              ].map((item, i) => (
                <div key={i} style={{marginBottom:"20px", paddingBottom:"20px", borderBottom: i < 3 ? "1px solid #eee" : "none"}}>
                  <p style={{fontWeight:"600", color:"#1a1a1a", marginBottom:"8px"}}>{item.q}</p>
                  <p style={{fontSize:"14px"}}>{item.a}</p>
                </div>
              ))}
              <p>Email us directly: <a href="mailto:brandsbrollc@gmail.com">brandsbrollc@gmail.com</a></p>
            </div>
          </div>
        </div>

        <footer>
          <p>© 2026 Product Options and Terms. <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a></p>
        </footer>
      </body>
    </html>
  );
}
