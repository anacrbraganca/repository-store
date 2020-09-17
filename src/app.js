const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const validateRepositoryExists = (request, response, next) => {
  const { id } = request.params;
  
  const index = repositories.findIndex(repository => repository.id.includes(id));

  if (index < 0) {
    return response.status(400).json({
      "message": "Repository not found!"
    });
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title, url, techs } = request.query;

  let repositoriesFiltered = title 
    ? repositories.filter(repository => repository.title.includes(title.trim())) 
    : repositories;

  repositoriesFiltered = url 
    ? repositories.filter(repository => repository.url.includes(url.trim())) 
    : repositories;

  repositoriesFiltered = techs
    ? repositories.filter(repository => repository.techs.includes(techs)) 
    : repositories;

  return response.json(repositoriesFiltered);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body; 

  const index = repositories.findIndex(repository => repository.id.includes(id));

  const repository = {
    ...repositories[index],
    ...{
      title,
      url,
      techs
    },
  };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id.includes(id));

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id.includes(id));
  
  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
