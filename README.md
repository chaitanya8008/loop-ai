# Data Ingestion API

So, this is an API that does **data stuff**. It's written in **Node.js** and **Express**. It kinda works like a batch processor that runs jobs based on priority.

---

## What It Does

* **POST /ingest**: You send a list of IDs and a priority (HIGH, MEDIUM, LOW). Simple.
* **GET /status/\:ingestion\_id**: Check if your stuff got processed yet.
* It batches up **3 IDs** and processes them every **5 seconds**.
* It processes jobs based on priority, then submission time. Yeah, that’s it.

---

## Tech

* Node.js (duh)
* Express (again, duh)
* UUID (to make things unique)

---

## Setup

1. Clone it:

```bash
git clone https://github.com/chaitanya8008/loop-ai.git
cd loop-ai
```
start: npm start
