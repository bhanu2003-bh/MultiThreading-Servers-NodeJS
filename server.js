import cluster from 'cluster';
import os from 'os';
import express from 'express';
import status from 'express-status-monitor';

const totalCpus = os.cpus().length;

if (cluster.isPrimary) {
    for (let i = 0; i < totalCpus; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    app.use(status());

    // Root endpoint to read and serve temp.txt
    app.get('/', (req, res) => {
        res.json({ 'message': 'The server is running with pid:', 'pid': process.pid });
    });

    // Start server on port 8000
    app.listen(8000, () => {
        console.log(`Running on PORT: 8000 with PID: ${process.pid}`);
    });
}
