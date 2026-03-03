import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
const PORT = 4000;

// ✅ Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/start-electron', (req, res) => {
  console.log('Received request to start Electron');

  // Launch Electron app (make sure it's installed and your Electron main process is running)
  exec('npm run electron-dev', (err, stdout, stderr) => {
    if (err) {
      console.error('Error starting Electron:', err);
      return res.status(500).send('Failed to start Electron');
    }

    console.log(stdout);
    return res.status(200).send('Electron started');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
