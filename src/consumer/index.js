const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  try {
    const results = [];

    for (const record of event.Records) {
      const body = JSON.parse(record.body);

      const taskId = body.taskId || randomUUID();
      const payload = body.payload;
      const createdAt = body.createdAt;

      console.log("Processing task:", {
        taskId,
        payload,
        createdAt,
        receivedAt: new Date().toISOString()
      });

      // Simulate work
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log("Task processed:", taskId);

      results.push({
        taskId,
        status: "processed"
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Batch processed",
        results
      })
    };
  } catch (err) {
    console.error("Consumer error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Consumer failed to process messages"
      })
    };
  }
};
