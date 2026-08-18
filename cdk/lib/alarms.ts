import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export const createDLQAlarm = (scope: Construct, dlq: sqs.Queue) => {
    // DLQ Alarm
    return new cloudwatch.Alarm(scope, "DLQAlarm", {
        alarmName: "task-dlq-has-messages",
        metric: dlq.metricApproximateNumberOfMessagesVisible(),
        threshold: 1,
        evaluationPeriods: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmDescription: "Triggered when the DLQ has at least 1 message.",
    });
}
