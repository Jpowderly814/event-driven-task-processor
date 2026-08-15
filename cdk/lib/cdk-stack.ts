import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the SQS queue
    const taskQueue = new sqs.Queue(this, 'TaskQueue', {
      queueName: 'task-queue',
      visibilityTimeout: cdk.Duration.seconds(30),
      retentionPeriod: cdk.Duration.days(4),
    });

    // Output the queue URL
    new cdk.CfnOutput(this, 'TaskQueueUrl', {
      value: taskQueue.queueUrl,
    });
  }
}
