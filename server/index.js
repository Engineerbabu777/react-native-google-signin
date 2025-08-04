const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = 5000;

const CLIENT_ID = "WEB_CLIENT_ID";

const client = new OAuth2Client(CLIENT_ID);

app.use(cors());
app.use(bodyParser.json());

app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "No idToken provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("User info:", payload);

    res.status(200).json({
      message: "Token verified successfully",
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
      },
      success: true,
    });
  } catch (err) {
    console.error("Token verification failed", err);
    res.status(401).json({ error: "Invalid idToken" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
