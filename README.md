# Event-Driven Task Processor

A small event-driven system built on AWS using Lambda, SQS, and CDK.  
The goal is to demonstrate a clean producer → queue → consumer workflow.

## Overview

This project will eventually include:

- A **producer Lambda** that sends tasks to an SQS queue  
- A **consumer Lambda** that processes those tasks  
- **AWS CDK** to provision all infrastructure  

Right now, only the producer Lambda is implemented.

## Project Structure

```
event-driven-task-processor/
  README.md
  .gitignore
  src/
    producer/
      index.js
      test.js
      package.json
```

## Producer Lambda (Current Component)

The producer Lambda:

- Uses ES modules (`import` / `export`)
- Uses AWS SDK v3
- Generates a UUID per task
- Builds a JSON payload
- Sends messages to SQS
- Includes a local test harness

## How to Test Locally

From the project root:

```bash
cd src/producer
npm install
```

Set environment variables:

```bash
export AWS_REGION=us-east-1
export TASK_QUEUE_URL=dummy
```

Run the test:

```bash
node test.js
```

AWS calls will fail locally until CDK provisions real infrastructure.  
This is expected — the Lambda logic still runs correctly.

## Next Steps

- Initialize CDK  
- Create SQS queue  
- Deploy producer Lambda  
- Implement consumer Lambda  
- Add Parameter Store for configuration
