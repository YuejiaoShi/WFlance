import DeveloperClientService from "../services/developerClientService.js";

class DeveloperClientsController {
  static async getClientsFromDeveloper(req, res) {
    try {
      const clients = await DeveloperClientService.getClientsFromDeveloper(
        req.params.id
      );
      res.status(200).json(clients);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  //   static async createProject(req, res) {
  //     try {
  //       const newProject = await DeveloperClientService.createProject(req.body);
  //       res.status(201).json(newProject);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }
  //   static async updateProject(req, res) {
  //     try {
  //       const updatedProject = await DeveloperClientService.updateProject(
  //         req.params.id,
  //         req.body
  //       );
  //       res.status(200).json(updatedProject);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }

  //   static async deleteProject(req, res) {
  //     try {
  //       await DeveloperClientService.deleteProject(req.params.id);
  //       res.status(200).json({ message: "Project deleted successfully" });
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }
}

export default DeveloperClientsController;
