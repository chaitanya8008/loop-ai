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

* Node.js
* Express
* UUID

---

## Setup

1. Clone it:

```bash
git clone https://github.com/chaitanya8008/loop-ai.git
cd loop-ai
```
start: npm start

![image](https://github.com/user-attachments/assets/8ce8ace4-d94e-4761-9e38-e53b754e4f85)
![image](https://github.com/user-attachments/assets/dd6c466f-57ed-4168-933d-a5bd453b6b49)

