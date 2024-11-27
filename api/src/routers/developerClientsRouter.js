import express from "express";
import developerClientsController from "../../controllers/developerClientsController.js";

const developerClientsRouter = express.Router();

developerClientsRouter.get("/clients/", (req, res) => {
  res.json({ message: "Hello from developerClientsRouter" });
});

developerClientsRouter.get(
  "/:developerId/AllClients",
  developerClientsController.getClientsFromDeveloper
);

//Assign a Client to a Developer
developerClientsRouter.post(
  "/:developerId/client/:clientId",
  developerClientsController.assignClientToDeveloper
);

developerClientsRouter.delete(
  "/:developerId/client/:clientId",
  developerClientsController.deleteClientFromDeveloper
);

// Get All Developers for a Client

// GET /client/{client_id}/developers

export default developerClientsRouter;
