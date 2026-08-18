import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";


export function createImageBucket(scope: Construct) {
    return new s3.Bucket(scope, "ImageBucket", {
      bucketName: "image-uploads-julie",
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });
  }
  
  export function createImageMetadataTable(scope: Construct) {
    return new dynamodb.Table(scope, "ImageMetadataTable", {
      tableName: "image-metadata",
      partitionKey: { name: "imageId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }