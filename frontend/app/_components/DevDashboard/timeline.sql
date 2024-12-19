CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    clientId INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    deadline DATE NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    client_name TEXT NOT NULL,
    CONSTRAINT fk_client FOREIGN KEY (clientId) REFERENCES clients (id)
);

CREATE TABLE timeline_events (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    description TEXT NOT NULL,
    link TEXT DEFAULT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- example: project 31 --

{
  "id": 31,
  "clientId": 38,
  "title": "Assist in integrating cloud platforms",
  "description": "description",
  "status": "completed",
  "budget": "2001.00",
  "startDate": "2024-11-22",
  "endDate": "2024-11-29",
  "deadline": "2024-11-26",
  "createdAt": "2024-11-22T11:40:41.154Z",
  "client": {
    "name": "DevAlchemists"
  },
  "timeline": [
    {
      "id": 1,
      "project_id": 31,
      "title": "Initial Planning",
      "event_date": "2024-11-22",
      "description": "Discuss project scope and deliverables",
      "link": null
    },
    {
      "id": 2,
      "project_id": 31,
      "title": "System Design",
      "event_date": "2024-11-23",
      "description": "Finalized system architecture",
      "link": null
    },
    {
      "id": 3,
      "project_id": 31,
      "title": "Integration Testing",
      "event_date": "2024-11-25",
      "description": "Begin cloud integration testing",
      "link": "http://example.com/test-result"
    }
  ]
}
