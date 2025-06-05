const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = 5000;

// --- In-memory storage ---
const ingestionStore = {}; // ingestion_id => { batches, status }
const jobQueue = [];       // priority queue

// --- Priority Mapping ---
const priorityMap = { HIGH: 1, MEDIUM: 2, LOW: 3 };

// --- Constants ---
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 5000; // 5 seconds

// --- Helper ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getOverallStatus(batches) {
    const statuses = batches.map(b => b.status);
    if (statuses.every(s => s === 'yet_to_start')) return 'yet_to_start';
    if (statuses.every(s => s === 'completed')) return 'completed';
    return 'triggered';
}

// --- Worker to process jobs every 5 seconds ---
async function startBatchProcessor() {
    while (true) {
        if (jobQueue.length > 0) {
            const job = jobQueue.shift();
            const ingestion = ingestionStore[job.ingestion_id];

            const batch = job.batch;
            batch.status = 'triggered';

            // Simulate async data fetching for each ID
            await Promise.all(batch.ids.map(id => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({ id, data: 'processed' });
                    }, 500); // Simulate processing delay
                });
            }));

            batch.status = 'completed';

            // Update global status
            ingestion.status = getOverallStatus(ingestion.batches);
        }

        await sleep(BATCH_DELAY_MS); // Wait 5 seconds before next batch
    }
}

// --- API Routes ---
// POST /ingest
app.post('/ingest', (req, res) => {
    const { ids, priority } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !priorityMap[priority]) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const ingestion_id = uuidv4();
    const batches = [];

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch_ids = ids.slice(i, i + BATCH_SIZE);
        const batch = {
            batch_id: uuidv4(),
            ids: batch_ids,
            status: 'yet_to_start',
            created_at: Date.now()
        };
        batches.push(batch);

        // Queue the batch
        jobQueue.push({
            ingestion_id,
            priority: priorityMap[priority],
            created_at: batch.created_at,
            batch
        });
    }

    // Sort queue after inserting (priority, then FIFO)
    jobQueue.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.created_at - b.created_at;
    });

    ingestionStore[ingestion_id] = {
        ingestion_id,
        status: 'yet_to_start',
        batches
    };

    return res.status(200).json({ ingestion_id });
});

// GET /status/:ingestion_id
app.get('/status/:ingestion_id', (req, res) => {
    const { ingestion_id } = req.params;
    const data = ingestionStore[ingestion_id];

    if (!data) return res.status(404).json({ error: 'Ingestion ID not found' });

    return res.status(200).json({
        ingestion_id,
        status: data.status,
        batches: data.batches.map(b => ({
            batch_id: b.batch_id,
            ids: b.ids,
            status: b.status
        }))
    });
});

// --- Start Server and Background Worker ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    startBatchProcessor(); // Start the background worker
});
