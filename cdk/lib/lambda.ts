import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import * as path from 'path';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export function createLambdas(scope: Construct, taskQueue: sqs.Queue, imageBucket: s3.Bucket, metadataTable: dynamodb.Table) {
    // Create Producer Lambda
    const producerLambda = new lambda.Function(scope, "ProducerLambda", {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, '../../src/producer')),
        environment: {
            TASK_QUEUE_URL: taskQueue.queueUrl,
        },
    });
    taskQueue.grantSendMessages(producerLambda);

    //Create Consumer Lambda
    const consumerLambda = new lambda.Function(scope, "ConsumerLambda", {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, '../../src/consumer')),
    });

    //grant permissions
    taskQueue.grantConsumeMessages(consumerLambda);
    metadataTable.grantWriteData(consumerLambda);
    imageBucket.grantWrite(consumerLambda);


    // Lambdas should define their own triggers.  This belongs in this file where we create/define lambdas
    // connects the queue - makes consumer lambda automatically trigger when messages arrive
    // with addEventSource becomes "event driven"
    consumerLambda.addEventSource(
        new lambdaEventSources.SqsEventSource(taskQueue, {
            batchSize: 10, // number of messages per invocation
        })
    );

    return { producerLambda, consumerLambda };
}
