import express from 'express';
import cors from 'cors';
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

const app =express();

const PORT=process.env.PORT || 4000;

//middleware
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";
app.use(cors({
  origin: ALLOWED_ORIGIN
}));

app.use(express.json());


//simple helper functions to read and write data
async function readData() {
    try{

        const raw = await fs.readFile(DATA_FILE,'utf-8');
        return JSON.parse(raw);

    }
    catch (err) {
        
        return [];
    }
    
}
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
        
    } catch (err) {
        await writeData([]);
    }
}

//simple validation function 
function validateDeveloper(payload) {
    const errors=[];
    if(!payload.name || typeof payload.name !=='string'|| payload.name.trim()===""){
        errors.push("name is required and should be a non-empty string.");
    }
    const validRoles = ["Frontend", "Backend", "Full-Stack"];
  if (!payload.role || !validRoles.includes(payload.role)) {
    errors.push(`role is required and must be one of: ${validRoles.join(", ")}`);
  }

  if (!payload.techStack || typeof payload.techStack !== "string" || payload.techStack.trim() === "") {
    errors.push("techStack is required (comma-separated string)");
  }

  if (payload.experience === undefined || payload.experience === null || isNaN(Number(payload.experience))) {
    errors.push("experience is required and must be a number (years)");
  } else if (Number(payload.experience) < 0) {
    errors.push("experience must be 0 or greater");
  }

  return errors;
}
    


//routes
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Backend (ESM) running' });
});

app.get('/developers', async(req,res)=>{
    try{
        const list =await readData();
        res.json(list);
    }
    catch(err){
        res.status(500).json({error:"Failed to read data"});
    }
});

app.post('/developers', async (req, res) => {
  try {
    const payload = req.body;

    // validate (make sure this function is defined as validateDeveloper)
    const errors = validateDeveloper(payload);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // normalize tech stack: split by comma, trim, remove empty
    const techArray = payload.techStack
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // create developer object
    const developer = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: payload.name.trim(),
      role: payload.role,
      techStack: techArray,
      experience: Number(payload.experience),
      createdAt: new Date().toISOString()
    };

    // ensure file exists, read, push, write
    await ensureDataFile();
    const data = await readData();
    data.push(developer);
    await writeData(data);

    res.status(201).json({ message: 'Developer saved', developer });
  } catch (err) {
    console.error('POST /developers error:', err);
    res.status(500).json({ error: 'Failed to save developer' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});