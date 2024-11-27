import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerController = Router();

swaggerController.get("/swagger.json", (req, res) => {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "YAR Solutions Project Management API",
      version: "1.0.0",
      description: "API for managing projects, users, and authentication.",
    },
    paths: {
      "/api/users": {
        post: {
          tags: ["Users"],
          summary: "Create a new user",
          description:
            "This endpoint creates a new user with the specified details. Requires an authorization token.",
          operationId: "createUser",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "John43454" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "johnd345oe3@example.com",
                    },
                    password: { type: "string", example: "securepassword1234" },
                    phone: { type: "string", example: "123456789034" },
                    roleName: { type: "string", example: "Client" },
                  },
                  required: ["name", "email", "password", "roleName"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      name: { type: "string", example: "John43454" },
                      email: {
                        type: "string",
                        example: "johnd345oe3@example.com",
                      },
                      phone: { type: "string", example: "123456789034" },
                      roleName: { type: "string", example: "Client" },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2024-11-25T12:34:56Z",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad Request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Validation error: Missing required fields.",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Unauthorized access.",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ["Users"],
          summary: "Fetch all users",
          description: "Retrieve a list of all users.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of users",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ... (rest of the paths remain the same)
      "/api/developer/{developerId}/AllClients": {
        get: {
          tags: ["Developer"],
          summary: "Get all clients assigned to a developer",
          description:
            "Fetches all clients assigned to a specific developer by their ID.",
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              description: "ID of the developer",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "A list of clients assigned to the developer",
              content: {
                "application/json": {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Client",
                  },
                },
              },
            },
            404: {
              description: "Developer not found",
            },
          },
        },
      },
      "/api/developer/{developerId}/client/{clientId}": {
        post: {
          tags: ["Developer"],
          summary: "Add a relation between a developer and a client",
          description:
            "Creates a new relation between a developer and a client by their respective IDs.",
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              description: "ID of the developer",
              schema: {
                type: "integer",
              },
            },
            {
              name: "clientId",
              in: "path",
              required: true,
              description: "ID of the client",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            201: {
              description: "Relation created successfully",
            },
            400: {
              description: "Invalid input or relation already exists",
            },
            404: {
              description: "Developer or client not found",
            },
          },
        },
        delete: {
          tags: ["Developer"],
          summary: "Delete a relation between a developer and a client",
          description:
            "Deletes the relation between a specific developer and client.",
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              description: "ID of the developer",
              schema: {
                type: "integer",
              },
            },
            {
              name: "clientId",
              in: "path",
              required: true,
              description: "ID of the client",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "Relation deleted successfully",
            },
            404: {
              description: "Relation not found",
            },
          },
        },
      },

      "/api/events/{userId}": {
        get: {
          tags: ["Events"],
          summary: "Get all calendar events for a specific user",
          description: "Returns all events associated with a given userId.",
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              description:
                "The ID of the user whose events are being retrieved.",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "A list of events.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "date-time" },
                        title: { type: "string" },
                        start: { type: "string", format: "date-time" },
                        end: { type: "string", format: "date-time" },
                        allDay: { type: "boolean" },
                        userId: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized. Missing or invalid token.",
            },
            404: {
              description: "User not found.",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        delete: {
          tags: ["Events"],
          summary: "Delete an event by eventId",
          description: "Deletes a specific event identified by its ID.",
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              description: "The ID of the event to delete.",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Successfully deleted the event.",
            },
            404: {
              description: "Event not found.",
            },
          },
        },
      },
      "/api/events/": {
        post: {
          tags: ["Events"],
          summary: "Create a new calendar event for a user",
          description:
            "Creates a new event for a user specified in the request body.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "date-time" },
                    title: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    allDay: { type: "boolean" },
                    userId: { type: "integer" },
                  },
                  required: ["id", "title", "start", "end", "allDay", "userId"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Event created successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "date-time" },
                      title: { type: "string" },
                      start: { type: "string", format: "date-time" },
                      end: { type: "string", format: "date-time" },
                      allDay: { type: "boolean" },
                      userId: { type: "integer" },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid request body.",
            },
            401: {
              description: "Unauthorized. Missing or invalid token.",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },

      "/api/projects/{projectId}/invoice": {
        get: {
          tags: ["Projects"],
          summary: "Generate an invoice for a project",
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              description: "ID of the project",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "Invoice successfully generated",
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
      },

      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Fetch user by ID",
          description: "Retrieve details of a specific user by their ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the user",
            },
          ],
          responses: {
            200: {
              description: "User details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                },
              },
            },
            404: { description: "User not found" },
          },
        },
      },

      "/api/developer/allClients": {
        get: {
          tags: ["Developer"],
          summary: "Fetch all clients",
          description: "Retrieve a list of all clients.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of clients",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/allDevelopers": {
        get: {
          tags: ["Developer"],
          summary: "Fetch all developers",
          description: "Retrieve a list of all developers.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of developers",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        skills: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/project/{projectId}": {
        get: {
          tags: ["Developer"],
          summary: "Fetch developers for a specific project",
          description:
            "Retrieve a list of developers associated with a project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "A list of developers for the project",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/getAllProjectsFromDeveloper/{developerId}": {
        get: {
          tags: ["Developer"],
          summary: "Fetch all projects assigned to a developer",
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              description: "ID of the developer",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "A list of projects for the specified developer",
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
      },
      "/api/developer/assignProject": {
        post: {
          tags: ["Developer"],
          summary: "Assign a developer to a project",
          description: "Assign a developer to a specific project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    developerId: { type: "string" },
                    projectId: { type: "string" },
                  },
                  required: ["developerId", "projectId"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Developer assigned to the project",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      developer: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/{developerId}/project/{projectId}": {
        delete: {
          tags: ["Developer"],
          summary: "Remove a developer from a project",
          description: "Remove a developer from a specific project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID of the developer",
            },
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "Developer removed from the project",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/login": {
        post: {
          tags: ["Authentication"],
          summary: "User login",
          description: "Authenticate a user and return a token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/projects": {
        get: {
          tags: ["Projects"],
          summary: "Fetch all projects",
          description: "Retrieve a list of all projects.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/projects/client/{clientId}": {
        get: {
          tags: ["Projects"],
          summary: "Fetch all projects of a client",
          description:
            "Retrieves all projects associated with a specific client ID.",
          parameters: [
            {
              name: "clientId",
              in: "path",
              required: true,
              description: "The ID of the client",
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "A list of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        name: {
                          type: "string",
                          example: "Project Alpha",
                        },
                        client_id: {
                          type: "integer",
                          example: 8,
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized. Missing or invalid token",
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },

      "/api/projects/{id}": {
        delete: {
          tags: ["Projects"],
          summary: "Delete a project by ID",
          description:
            "Deletes a specific project based on the provided project ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project to delete",
            },
          ],
          responses: {
            200: {
              description: "Project deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                  example: {
                    message: "Project deleted successfully",
                  },
                },
              },
            },
            404: {
              description: "Project not found",
              content: {
                "application/json": {
                  example: {
                    error: "Project not found",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
                  },
                },
              },
            },
          },
        },
      },
      "/api/chat/send": {
        post: {
          tags: ["Chat"],
          summary: "Send a chat message",
          description: "Sends a chat message from one user to another.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    senderId: {
                      type: "integer",
                      description: "ID of the sender",
                    },
                    receiverId: {
                      type: "integer",
                      description: "ID of the receiver",
                    },
                    message: {
                      type: "string",
                      description: "The message content",
                    },
                  },
                  required: ["senderId", "receiverId", "message"],
                },
                example: {
                  senderId: 8,
                  receiverId: 9,
                  message: "This is a test message",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Message sent successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      messageId: { type: "integer" },
                    },
                  },
                  example: {
                    success: true,
                    messageId: 123,
                  },
                },
              },
            },
            400: {
              description: "Bad Request - Missing or invalid fields",
              content: {
                "application/json": {
                  example: {
                    error: "Message content cannot be empty",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
                  },
                },
              },
            },
          },
        },
      },

      "/api/projects/create": {
        post: {
          tags: ["Projects"],
          summary: "Create a new project",
          description: "Create a new project with the specified details.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    budget: { type: "number" },
                  },
                  required: ["title", "description", "budget"],
                },
                example: {
                  title: "New Project tester",
                  description: "Project description",
                  budget: 15000,
                },
              },
            },
          },
          responses: {
            201: {
              description: "Project created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      budget: { type: "number" },
                    },
                  },
                },
              },
            },
            400: { description: "Invalid input" },
          },
        },
      },

      // Corrected the problematic path specification for project update
      "/api/projects/{projectId}": {
        get: {
          tags: ["Projects"],
          summary: "Fetch a project by ID",
          description: "Retrieve details of a specific project by ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "Project details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      budget: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Projects"],
          summary: "Update Project by ID",
          description:
            "Updates the details of an existing project identified by `projectId`.",
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              description: "The ID of the project to update.",
              schema: {
                type: "integer",
              },
            },
          ],
          requestBody: {
            description: "Project details to update.",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clientId: {
                      type: "integer",
                      example: 9,
                    },
                    title: {
                      type: "string",
                      example: "Project tester modificated now",
                    },
                    description: {
                      type: "string",
                      example: "Project description modificated",
                    },
                    status: {
                      type: "string",
                      enum: [
                        "not-started",
                        "in-progress",
                        "completed",
                        "cancelled",
                      ],
                      example: "in-progress",
                    },
                    budget: {
                      type: "string",
                      format: "decimal",
                      example: "20000.00",
                    },
                    startDate: {
                      type: "string",
                      format: "date",
                      example: "2024-10-15",
                    },
                    endDate: {
                      type: "string",
                      format: "date",
                      example: "2025-02-28",
                    },
                    deadline: {
                      type: "string",
                      format: "date",
                      example: "2025-01-15",
                    },
                  },
                  required: [
                    "clientId",
                    "title",
                    "status",
                    "budget",
                    "startDate",
                    "endDate",
                    "deadline",
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Project updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "Project updated successfully.",
                      },
                      data: {
                        type: "object",
                        description: "Updated project details.",
                        properties: {
                          projectId: {
                            type: "integer",
                            example: 1,
                          },
                          clientId: {
                            type: "integer",
                            example: 9,
                          },
                          title: {
                            type: "string",
                            example: "Project tester modificated now",
                          },
                          description: {
                            type: "string",
                            example: "Project description modificated",
                          },
                          status: {
                            type: "string",
                            example: "in-progress",
                          },
                          budget: {
                            type: "string",
                            example: "20000.00",
                          },
                          startDate: {
                            type: "string",
                            example: "2024-10-15",
                          },
                          endDate: {
                            type: "string",
                            example: "2025-02-28",
                          },
                          deadline: {
                            type: "string",
                            example: "2025-01-15",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid input or validation error.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: false,
                      },
                      message: {
                        type: "string",
                        example: "Invalid input data.",
                      },
                      errors: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        example: [
                          "Title is required.",
                          "Start date must be a valid date.",
                        ],
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Project not found.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: false,
                      },
                      message: {
                        type: "string",
                        example: "Project not found.",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/user": {
        get: {
          tags: ["Users"],
          summary: "Fetch user email and role",
          description:
            "Fetch the user's email and role based on the provided token.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "User details retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                  example: {
                    email: "user@example.com",
                    role: "Client",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
                  },
                },
              },
            },
          },
        },
      },

      "/api/chat/history/{senderId}/{receiverId}": {
        get: {
          tags: ["Chat"],
          summary: "Fetch chat history",
          description: "Retrieve chat history between two users.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "senderId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the sender user",
            },
            {
              name: "receiverId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the receiver user",
            },
          ],
          responses: {
            200: {
              description: "Chat history retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        senderId: { type: "integer" },
                        receiverId: { type: "integer" },
                        message: { type: "string" },
                        timestamp: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  res.json(swaggerSpec);
});

swaggerController.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../others/swagger-ui.html"));
});

export default swaggerController;
