import EventService from "../services/eventService.js";

class EventController {
  static async createEvents(req, res) {
    try {
      const events = await EventService.createEvents(req.body);
      res.status(201).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEventsByUserId(req, res) {
    try {
      const events = await EventService.getEventsByUserId(req.params.id);
      res.status(200).json(events);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      await EventService.deleteEvent(req.params.id);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default EventController;
