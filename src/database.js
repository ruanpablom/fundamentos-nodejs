import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, filter) {
    let data = this.#database[table] ?? []

    if(filter){
      data = data.filter(item => {
        let itemIsValid = false
        for(const [key, value] of Object.entries(filter)){
          itemIsValid = item[key] === value
          if(!itemIsValid) return false
        }
  
        return itemIsValid;
      })
    }
    
    return data
  }

  insert(table, data) {
    const actualDate = new Date()

    data.id = randomUUID()
    data.created_at = actualDate
    data.updated_at = actualDate
    data.completed_at = null

    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    }else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  update(table, data, id) {
    data.updated_at = new Date()
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = {...this.#database[table][rowIndex], ...data}
      this.#persist()
    }
    
  }

  delete(table, id) {
    const filteredDatabase = this.#database[table].filter(row => row.id !== id);

    this.#database[table] = filteredDatabase
    this.#persist()
  }
}