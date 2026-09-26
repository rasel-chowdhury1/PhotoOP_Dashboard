const PrivacyPolicyPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .privacy-policy-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          background-color: #ffffff;
          color: #333;
          line-height: 1.6;
        }
        .privacy-policy-page h1,
        .privacy-policy-page h2 {
          color: #DD1122;
        }
        .privacy-policy-page h1 {
          text-align: center;
          margin-bottom: 10px;
        }
        .privacy-policy-page p.intro {
          text-align: center;
          font-style: italic;
          margin-bottom: 40px;
        }
        .privacy-policy-page section {
          margin-bottom: 25px;
        }
        .privacy-policy-page ul {
          padding-left: 20px;
        }
        .privacy-policy-page footer {
          margin-top: 60px;
          font-size: 0.9rem;
          color: #888;
          text-align: center;
        }
      `}</style>

      <div className="privacy-policy-page">
        <h1>Photop Privacy Policy</h1>
        <p className="intro">Your privacy matters to us</p>

        <section>
          <p>
            <strong>Photop</strong> values your privacy and is committed to protecting your
            personal information. This Privacy Policy explains how we collect, use, and
            safeguard your data.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, email, and contact details</li>
            <li>App usage data (such as bookings and activity logs)</li>
            <li>Basic device information</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our services</li>
            <li>To enhance user experience</li>
            <li>To ensure security and customer support</li>
          </ul>
        </section>

        <section>
          <h2>Data Protection</h2>
          <p>
            We use appropriate security measures to protect your data.
            We do not sell or share your personal information with third parties.
          </p>
        </section>

        <section>
          <p>By using the Photop app, you agree to this Privacy Policy.</p>
          <p>
            📧 Contact: <a href="mailto:privacy@photop.app">privacy@photop.app</a>
          </p>
        </section>

        <footer>
          &copy; {currentYear} Photop. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
