import { Duration } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export const createQueues = (scope: Construct) => {    
    //Deadletter queue for taskQueue
    const dlq = new sqs.Queue(scope, "TaskDLQ", {
      queueName: "task-dlq",
      retentionPeriod: Duration.days(3),
    });
  
    // Create the SQS queue
    const taskQueue = new sqs.Queue(scope, "TaskQueue", {
      queueName: "task-queue",
      visibilityTimeout: Duration.seconds(30),
      retentionPeriod: Duration.days(4),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: dlq,
      },
    });
  
    return { taskQueue, dlq };
  };
  