import { redirect } from "react-router";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};

export default function Index() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Product Fields & Terms — Custom Fields for Shopify</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          a[href^='#'] { scroll-behavior: smooth; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; }
          .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 60px; border-bottom: 1px solid #eee; position: sticky; top: 0; background: white; z-index: 100; }
          .nav-logo { font-size: 20px; font-weight: 700; color: #1a1a1a; text-decoration: none; }
          .nav-links { display: flex; gap: 32px; align-items: center; }
          .nav-links a { text-decoration: none; color: #555; font-size: 15px; }
          .btn { padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
          .btn-primary { background: #008060; color: white; }
          .btn-secondary { background: white; color: #1a1a1a; border: 2px solid #ddd; }
          .hero { padding: 100px 60px; text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%); }
          .hero h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
          .hero h1 span { color: #008060; }
          .hero p { font-size: 20px; color: #555; max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }
          .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
          .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; margin-bottom: 24px; }
          .section { padding: 100px 60px; }
          .section-white { background: white; }
          .section-gray { background: #f9fafb; }
          .section h2 { font-size: 40px; font-weight: 700; text-align: center; margin-bottom: 16px; }
          .section-sub { text-align: center; color: #555; font-size: 18px; margin-bottom: 64px; }
          .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1100px; margin: 0 auto; }
          .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 800px; margin: 0 auto; }
          .card { padding: 32px; border-radius: 16px; border: 1px solid #eee; background: white; }
          .card-featured { border: 2px solid #008060; background: #f0fdf4; }
          .card-icon { font-size: 32px; margin-bottom: 16px; }
          .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          .card p { color: #555; line-height: 1.6; font-size: 15px; }
          .step { text-align: center; }
          .step-num { width: 48px; height: 48px; border-radius: 50%; background: #008060; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
          .price { font-size: 48px; font-weight: 800; margin: 16px 0; }
          .price span { font-size: 16px; font-weight: 400; color: #555; }
          .price-features { list-style: none; margin: 24px 0 32px; }
          .price-features li { padding: 8px 0; color: #555; font-size: 15px; border-bottom: 1px solid #eee; }
          .price-features li::before { content: "✓ "; color: #008060; font-weight: 700; }
          .cta-section { padding: 100px 60px; background: #008060; text-align: center; }
          .cta-section h2 { font-size: 40px; font-weight: 700; color: white; margin-bottom: 16px; }
          .cta-section p { color: rgba(255,255,255,0.8); font-size: 18px; margin-bottom: 40px; }
          .btn-white { background: white; color: #008060; }
          .footer { padding: 60px; background: #1a1a1a; color: #999; }
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; margin-bottom: 40px; }
          .footer-logo { font-size: 20px; font-weight: 700; color: white; margin-bottom: 16px; }
          .footer h4 { color: white; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
          .footer ul { list-style: none; }
          .footer ul li { margin-bottom: 8px; }
          .footer ul li a { color: #999; text-decoration: none; font-size: 14px; }
          .footer ul li a:hover { color: white; }
          .footer-bottom { border-top: 1px solid #333; padding-top: 24px; font-size: 14px; }
          @media (max-width: 768px) {
            .nav { padding: 16px 24px; }
            .hero { padding: 60px 24px; }
            .hero h1 { font-size: 36px; }
            .section { padding: 60px 24px; }
            .grid-3, .grid-2 { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr; gap: 32px; }
            .footer { padding: 40px 24px; }
            .cta-section { padding: 60px 24px; }
          }
        `}</style>
      </head>
      <body>
        <nav className="nav">
          <a href="/" className="nav-logo">Product Fields & Terms</a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>

            <a href="https://apps.shopify.com/product-fields-terms" className="btn btn-primary">Install app</a>
          </div>
        </nav>

        <section className="hero">
          <div className="badge">✨ Built for Shopify</div>
          <h1>Custom fields for your<br /><span>product pages</span></h1>
          <p>Add text inputs, dropdowns, checkboxes, and agreement fields to any product page. Customer responses are saved directly in your orders.</p>
          <div className="hero-btns">
            <a href="https://apps.shopify.com/product-fields-terms" className="btn btn-primary">Install free on Shopify</a>
            <a href="#how-it-works" className="btn btn-secondary">See how it works</a>
          </div>
        </section>

        <section className="section section-white" id="features">
          <h2>Everything you need</h2>
          <p className="section-sub">Powerful features to collect customer information at checkout</p>
          <div className="grid-3">
            {[
              { icon: "📝", title: "Text inputs", desc: "Let customers enter custom text like engraving messages, special instructions, or personalization details." },
              { icon: "📋", title: "Dropdown menus", desc: "Give customers a list of options to choose from. Perfect for sizes, colors, gift wrap options and more." },
              { icon: "☑️", title: "Checkboxes", desc: "Simple yes/no fields for add-ons, upgrades, or optional preferences." },
              { icon: "🔒", title: "Agreement fields", desc: "Required checkboxes for terms & conditions, age verification, or any mandatory agreements." },
              { icon: "🎯", title: "Product targeting", desc: "Show fields on all products or limit to specific products or collections." },
              { icon: "📦", title: "Order integration", desc: "All customer responses are automatically saved as line item properties in your Shopify orders." },
            ].map((f) => (
              <div key={f.title} className="card">
                <div className="card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-gray" id="how-it-works">
          <h2>How it works</h2>
          <p className="section-sub">Set up custom fields in 3 simple steps</p>
          <div className="grid-3">
            {[
              { num: "1", title: "Create a field group", desc: "Give your group a name and choose which products it applies to — all products or a specific one." },
              { num: "2", title: "Add custom fields", desc: "Add text inputs, dropdowns, checkboxes, or agreement fields with your own labels and options." },
              { num: "3", title: "See it in orders", desc: "Customer answers are saved as line item properties and appear directly in your Shopify orders." },
            ].map((s) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-white" id="pricing">
          <h2>Free during beta</h2>
          <p className="section-sub">We are currently in beta — all features are completely free</p>
          <div style={{maxWidth:"480px", margin:"0 auto"}}>
            <div className="card card-featured" style={{textAlign:"center"}}>
              <div className="badge">🎉 Beta — Limited time</div>
              <h3 style={{marginTop:"16px"}}>All features free</h3>
              <div className="price">$0<span>/month</span></div>
              <ul className="price-features" style={{textAlign:"left"}}>
                <li>Unlimited field groups</li>
                <li>All field types</li>
                <li>Product & collection targeting</li>
                <li>Order integration</li>
                <li>Email support</li>
              </ul>
              <a href="https://apps.shopify.com/product-fields-terms" className="btn btn-primary" style={{display:"block", textAlign:"center"}}>Install free on Shopify</a>
            </div>
          </div>
        </section>

        <section className="section section-gray" id="faq">
          <h2>Frequently asked questions</h2>
          <p className="section-sub">Everything you need to know about Product Fields & Terms</p>
          <div style={{maxWidth:"700px", margin:"0 auto"}}>
            {[
              { q: "How do I show fields on my product page?", a: "Go to Online Store → Themes → Customize → Product page → Add block → find 'Product Fields' under Apps section. Save and the fields will appear." },
              { q: "Where do I see customer responses?", a: "Customer responses are saved as line item properties. Go to Orders → click any order → you'll see the responses listed under each product." },
              { q: "Can I assign fields to specific products only?", a: "Yes! Inside each field group, use the Product targeting section to assign fields to a specific product or collection." },
              { q: "How do I add options to a dropdown field?", a: "Open a field group → click on a Dropdown field → click the Options button → add your choices there. You can also drag to reorder them." },
              { q: "Can I temporarily hide fields without deleting them?", a: "Yes! Use the Deactivate button on any field group to hide it from your storefront without deleting it." },
              { q: "Is this app free?", a: "Yes! Product Fields & Terms is completely free during our beta period. All features are included at no cost." },
            ].map((item, i, arr) => (
              <div key={i} style={{padding:"24px 0", borderBottom: i < arr.length - 1 ? "1px solid #e5e7eb" : "none"}}>
                <p style={{fontWeight:"700", fontSize:"17px", marginBottom:"10px", color:"#1a1a1a"}}>{item.q}</p>
                <p style={{color:"#555", lineHeight:"1.8"}}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-white" id="support">
          <h2>Need help?</h2>
          <p className="section-sub">We're here to help you get the most out of Product Fields & Terms</p>
          <div style={{maxWidth:"500px", margin:"0 auto", textAlign:"center"}}>
            <div className="card" style={{padding:"48px"}}>
              <div style={{fontSize:"48px", marginBottom:"24px"}}>✉️</div>
              <h3 style={{fontSize:"24px", marginBottom:"16px"}}>Send us an email</h3>
              <p style={{color:"#555", marginBottom:"32px", lineHeight:"1.8"}}>
                Have a question or need support? Send us an email and we'll get back to you within 24 hours.
              </p>
              <a 
                href="mailto:brandsbrollc@gmail.com" 
                className="btn btn-primary"
                style={{display:"block", textAlign:"center", fontSize:"18px", padding:"16px 32px"}}
              >
                brandsbrollc@gmail.com
              </a>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to get started?</h2>
          <p>Install Product Fields & Terms and start collecting customer information today.</p>
          <a href="https://apps.shopify.com/product-fields-terms" className="btn btn-white">Install free on Shopify →</a>
        </section>

        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Product Fields & Terms</div>
              <p style={{fontSize:"14px", lineHeight:"1.6"}}>Add custom fields to your Shopify product pages and collect customer information at checkout.</p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How it works</a></li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy policy</a></li>
                <li><a href="/terms">Terms of service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Product Fields & Terms. All rights reserved.</p>
          </div>
        </footer>
      <script dangerouslySetInnerHTML={{__html: `
        window.addEventListener('load', function() {
          document.querySelectorAll('a[href^="#"]').forEach(function(a) {
            a.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              var t = document.getElementById(this.getAttribute('href').slice(1));
              if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
            });
          });
        });
      `}} />
      </body>
    </html>
  );
}
