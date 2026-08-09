import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";

// Create an SQS client using the region provided by the Lambda environment.
// CDK will inject AWS_REGION automatically when the function is deployed.
const sqs = new SQSClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  try {
    const taskId = randomUUID();

    // Build the message payload that will be sent to SQS.
    // Including timestamps and IDs makes debugging and tracing easier.
    const body = JSON.stringify({
      taskId,
      createdAt: new Date().toISOString(),
      payload: event.payload || "default payload"
    });

    // SQS requires a QueueUrl and a MessageBody.
    // CDK will inject TASK_QUEUE_URL as an environment variable.
    const params = {
      QueueUrl: process.env.TASK_QUEUE_URL,
      MessageBody: body
    };

    const command = new SendMessageCommand(params);
    const response = await sqs.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task sent to SQS",
        messageId: response.MessageId,
        taskId
      })
    };
  } catch (err) {
    console.error("Error sending message:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message" })
    };
  }
};
