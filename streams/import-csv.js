import fs from "node:fs"
import { parse } from 'csv-parse';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2 // skip the header line
});

async function run(){
  const linesParse = stream.pipe(csvParse);

  for await(const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      body: JSON.stringify({title, description}),
      headers: {'Content-Type': 'aplication/json'}
    })

  }
}

run();