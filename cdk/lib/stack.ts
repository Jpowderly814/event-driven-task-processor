import { createLambdas } from "./lambda";
import { createQueues } from "./queues";
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createDLQAlarm } from "./alarms";
import { createImageBucket, createImageMetadataTable } from "./storage";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { taskQueue, dlq } = createQueues(this);

    const imageBucket = createImageBucket(this);
    const metadataTable = createImageMetadataTable(this);

    const { producerLambda, consumerLambda } = createLambdas(this, taskQueue, imageBucket, metadataTable);
    createDLQAlarm(this, dlq);
  }
}