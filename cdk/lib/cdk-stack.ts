import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as path from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the SQS queue
    const taskQueue = new sqs.Queue(this, 'TaskQueue', {
      queueName: 'task-queue',
      visibilityTimeout: cdk.Duration.seconds(30),
      retentionPeriod: cdk.Duration.days(4),
    });

    // Create Producer Lambda
    const producerLambda = new lambda.Function(this, 'ProducerLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/producer')),
      environment: {
        TASK_QUEUE_URL: taskQueue.queueUrl,
      },
    });
    taskQueue.grantSendMessages(producerLambda);


    //Create Consumer Lambda
    const consumerLambda = new lambda.Function(this, 'ConsumerLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/consumer')),
    });
    taskQueue.grantConsumeMessages(consumerLambda);
    
    //connects the queue - makes consumer lambda automatically trigger when messages arrive
    // with addEventSource becomes "event driven"
    consumerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(taskQueue, {
        batchSize: 10, // number of messages per invocation
      })
    );

    // Output the queue URL
    new cdk.CfnOutput(this, 'TaskQueueUrl', {
      value: taskQueue.queueUrl,
    });
  }
}
