import express from "express";
import developerClientsController from "../../controllers/developerClientsController.js";

const developerClientsRouter = express.Router();

developerClientsRouter.get("/clients/", (req, res) => {
  res.json({ message: "Hello from developerClientsRouter" });
});

developerClientsRouter.get(
  "/:id/AllClients",
  developerClientsController.getClientsFromDeveloper
);

export default developerClientsRouter;
