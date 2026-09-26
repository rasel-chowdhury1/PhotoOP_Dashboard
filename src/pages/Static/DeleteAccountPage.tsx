const DeleteAccountPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .delete-account-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          padding: 0;
          background-color: #ffffff;
          color: #333;
          line-height: 1.6;
        }
        .delete-account-page h1,
        .delete-account-page .intro {
          text-align: center;
        }
        .delete-account-page h1 {
          color: #DD1122;
          margin-bottom: 10px;
        }
        .delete-account-page h2 {
          color: #DD1122;
          margin-top: 32px;
        }
        .delete-account-page .step {
          margin-bottom: 26px;
          text-align: left;
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
        }
        .delete-account-page .illustration {
          display: block;
          margin: 10px auto;
          max-width: 320px;
          max-height: 200px;
          width: 100%;
          height: auto;
          object-fit: contain;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 4px;
          background: #fff;
        }
        .delete-account-page footer {
          margin-top: 48px;
          font-size: 0.9rem;
          color: #888;
          text-align: center;
        }
      `}</style>

      <div className="delete-account-page">
        <h1>Steps to Delete Your Account</h1>
        <p className="intro">
          Follow these steps to permanently delete your account from the{" "}
          <strong>Photop</strong> app.
        </p>

        <div className="step">
          <h2>Step 1: Open Settings</h2>
          <p>Go to your profile and tap <strong>Settings</strong>.</p>
          <img
            src="https://res.cloudinary.com/dns84qf2p/image/upload/settting_kpovfr.png"
            alt="Open Settings"
            className="illustration"
          />
        </div>

        <div className="step">
          <h2>Step 2: Choose &ldquo;Delete Account&rdquo;</h2>
          <p>Scroll to the bottom and tap <strong>Delete Account</strong>.</p>
          <img
            src="https://res.cloudinary.com/dns84qf2p/image/upload/delete_sbcwn7.png"
            alt="Choose Delete Account"
            className="illustration"
          />
        </div>

        <div className="step">
          <h2>Step 3: Confirm Your Identity and account Deletion</h2>
          <p>
            When prompted, enter your account password or complete the required
            verification to confirm your identity.
          </p>
          <img
            src="https://res.cloudinary.com/dns84qf2p/image/upload/inputDelete_tutwii.png"
            alt="Confirm Identity"
            className="illustration"
          />
        </div>

        <footer>
          &copy; {currentYear} Photop. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default DeleteAccountPage;
