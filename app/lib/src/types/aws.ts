
export type AwsRegion__Territory = "us" | "us" | "ca" | "af" | "ap" | "eu" | "me" | "sa";
export type AwsSubRegion =
    | "east"
    | "west"
    | "south"
    | "north"
    | "southeast"
    | "northeast"
    | "central";
  

  /**
 * Provides a string lookup of a AWS region's
 * geographic name based on it's more technical AWS region
 * name.
 *
 * For instance, `us-east-1` looks up to "N. Virginia", etc.
 */
export type AwsRegion = `${AwsRegion__Territory}-${AwsSubRegion}-${number}`
  

/**
 * A AWS _resource_ id which is used as part of AWS **ARN**.
 * This type provides a set of common examples but allows
 * any string as well to provide a safety hatch.
 */
export type AwsService =
  | "lambda"
  | "iam"
  | "logs"
  | "states"
  | "sqs"
  | "s3"
  | "sns"
  | "dynamodb"
  | "events";
