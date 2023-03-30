let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 5000;

const randomID = (req, res, next) => {
  if (req.method === "POST") {
    req.id = Math.floor(Math.random() * 100);
    next();
  }
};

morgan.token("id", (req, res) => {
  return req.id;
});

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan("tiny"));

app
  .get("/api/persons", (req, res) => {
    res.json(persons);
  })
  .post(
    "/api/persons",
    randomID,
    morgan(`:method :url :id :status :response-time ms :data `),
    (req, res) => {
      const { name, number } = req.body;
      if (!name || !number) {
        return res.status(400).json({
          error: "content missing",
        });
      }
      if (persons.find((p) => p.name === name)) {
        return res.status(400).json({
          error: "name must be unique",
        });
      }
      const person = {
        id: req.id,
        name: name,
        number: number,
      };
      persons = persons.concat(person);
      res.json(person);
    }
  );

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people\n${new Date().toString()}`
  );
});

app
  .get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.filter((p) => p.id === id);
    person ? res.json(person) : res.status(404).end();
  })
  .delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
