import subscribeEmailController from "../../controllers/subscribeEmailController.js";

import express from "express";

const subscribeEmailRouter = express.Router();

subscribeEmailRouter.get("/test", (req, res) => {
  res.json({ message: "Hello,this user router works" });
});

subscribeEmailRouter.post(
  "/subscribeEmail",
  subscribeEmailController.subscribeEmail
);

export default subscribeEmailRouter;
