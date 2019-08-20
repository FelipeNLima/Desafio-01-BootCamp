const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let numberOfRequests = 0;

//Verificar se o projeto com aquele ID existe
function checkProjectExists(req, res, next) {
  const {
    id
  } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({
      error: 'Project not found'
    });
  }

  return next();
}

// Numero de Requisição
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//listar todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});


// Criar projetos
server.post('/projects', (req, res) => {
  const {
    id,
    title
  } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Inserindo Tarefas
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const {
    id
  } = req.params;
  const {
    title
  } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Editar Projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {

  const {
    id
  } = req.params;

  const {
    title
  } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);

});

//Deletar Projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const {
    id
  } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);