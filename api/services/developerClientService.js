import developerClientModel from "../models/developerClient.js";

class developerClientService {
  static async getClientsFromDeveloper(id) {
    try {
      const clients = await developerClientModel.findAll({
        where: { developerId: id },
      });
      if (!clients) {
        throw new Error("clients not found");
      }
      return clients;
    } catch (error) {
      throw new Error("Error fetching clients: " + error.message);
    }
  }

  static async assignClientToDeveloper(developerId, clientId) {
    console.log("Assigning client", clientId, "to developer", developerId);
    try {
      const existingRelation = await developerClientModel.findOne({
        where: {
          developerId,
          clientId,
        },
      });
      if (existingRelation) {
        throw new Error("This client is already assigned to the developer.");
      }

      const newRelation = await developerClientModel.create({
        developerId,
        clientId,
      });

      return newRelation;
    } catch (error) {
      throw new Error("Error assigning client to developer: " + error.message);
    }
  }

  static async deleteClientFromDeveloper(developerId, clientId) {
    try {
      const relation = await developerClientModel.findOne({
        where: { clientId, developerId },
      });
      if (!relation) {
        throw new Error("Relation developer-client not found");
      }
      await relation.destroy();
      return { message: "Relation developer-client deleted successfully" };
    } catch (error) {
      throw new Error(
        "Error deleting developer-client relation: " + error.message
      );
    }
  }
}

export default developerClientService;
