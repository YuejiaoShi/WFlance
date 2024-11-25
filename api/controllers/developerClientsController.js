import DeveloperClientService from "../services/developerClientService.js";

class DeveloperClientsController {
  static async getClientsFromDeveloper(req, res) {
    try {
      const clients = await DeveloperClientService.getClientsFromDeveloper(
        req.params.developerId
      );
      res.status(200).json(clients);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async assignClientToDeveloper(req, res) {
    try {
      const newRelation = await DeveloperClientService.assignClientToDeveloper(
        req.params.developerId,
        req.params.clientId
      );
      res.status(201).json(newRelation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteClientFromDeveloper(req, res) {
    try {
      await DeveloperClientService.deleteClientFromDeveloper(
        req.params.developerId,
        req.params.clientId
      );
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default DeveloperClientsController;
