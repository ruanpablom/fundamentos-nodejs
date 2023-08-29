import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js"
import { propertiesValidation } from "./validations/properties.js";

const db = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const validation = propertiesValidation(["title", "description"], req.body);
      if(validation.length > 0) {
        return res.writeHead(400).end(JSON.stringify({errors: validation}))
      }

      const { title, description } = req.body;

      db.insert('tasks', {title, description})

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const tasks = db.select('tasks')

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const validation = propertiesValidation(["title", "description"], req.body);
      if(validation.length > 0) {
        return res.writeHead(400).end(JSON.stringify({errors: validation}))
      }

      const { id } = req.params
      
      const [task] = db.select('tasks', {id})
      if(!task){
        return res.writeHead(404).end(JSON.stringify({error: "Invalid id"}))
      }

      const { title, description } = req.body

      db.update('tasks', {title, description}, id)

      return res.writeHead(200).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      
      const [task] = db.select('tasks', {id})
      if(!task){
        return res.writeHead(404).end(JSON.stringify({error: "Invalid id"}))
      }

      if(task['completed_at']){
        return res.writeHead(400).end(JSON.stringify({error: `task completed at ${task['completed_at']}`}))
      }

      db.update('tasks', {completed_at: new Date()}, id)

      return res.writeHead(200).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = db.select('tasks', {id})
      if(!task){
        return res.writeHead(404).end(JSON.stringify({error: "Invalid id"}))
      }

      db.delete('tasks', id)

      return res.writeHead(200).end()
    }
  }
]