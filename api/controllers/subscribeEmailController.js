import subscribeEmailService from "../services/subscribeEmailService.js";

const subscribeEmail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email not found" });
  }
  try {
    const suscribeEmail = await subscribeEmailService.subscribeEmail(email);
    res.status(201).json({
      message: "Email subscribed successfully!",
      suscribeEmail,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error subscribing email",
      error: err.message,
    });
  }
};

export default { subscribeEmail };
