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

  //   static async getProjectsByClientId(clientId) {
  //     try {
  //       const project = await developerClientModel.findAll({
  //         where: { clientId: clientId },
  //       });
  //       if (!project) {
  //         throw new Error("Project or client not found");
  //       }
  //       return project;
  //     } catch (error) {
  //       throw new Error("Error fetching projects: " + error.message);
  //     }
  //   }

  //   static async updateProject(id, updatedData) {
  //     try {
  //       const project = await developerClientModel.findByPk(id);
  //       if (!project) {
  //         throw new Error("Project not found");
  //       }
  //       const updatedProject = await project.update(updatedData);
  //       return updatedProject;
  //     } catch (error) {
  //       throw new Error("Error updating project: " + error.message);
  //     }
  //   }

  //   static async deleteProject(id) {
  //     try {
  //       const project = await developerClientModel.findByPk(id);
  //       if (!project) {
  //         throw new Error("Project not found");
  //       }
  //       await project.destroy();
  //       return { message: "Project deleted successfully" };
  //     } catch (error) {
  //       throw new Error("Error deleting project: " + error.message);
  //     }
  //   }
}

export default developerClientService;
