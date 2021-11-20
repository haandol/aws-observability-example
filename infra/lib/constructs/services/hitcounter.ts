import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as sqs from '@aws-cdk/aws-sqs'
import * as lambda from '@aws-cdk/aws-lambda'
import * as eventSources from '@aws-cdk/aws-lambda-event-sources'
import { App, Table } from '../../constants/config'

export class HitCounterService extends cdk.Construct {
  public readonly getCount: lambda.IFunction
  public readonly updateCount: lambda.IFunction
  public readonly queue: sqs.IQueue
  public readonly consumer: lambda.IFunction

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const ns = App.Context.Namespace
    this.updateCount = new lambda.Function(this, `UpdateCount`, {
      functionName: `${ns}UpdateCount`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', '..', 'functions', 'hitcounter')),
      handler: 'update.index.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Table.Name,
      },
    })
    this.updateCount.addToRolePolicy(new iam.PolicyStatement({
      actions: Table.Actions.ReadWrite,
      resources: Table.getResources(this),
    }))

    this.getCount = new lambda.Function(this, `GetCount`, {
      functionName: `${ns}GetCount`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', '..', 'functions', 'hitcounter')),
      handler: 'get.index.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Table.Name,
      },
    })
    this.getCount.addToRolePolicy(new iam.PolicyStatement({
      actions: Table.Actions.Read,
      resources: Table.getResources(this),
    }))

    this.queue = new sqs.Queue(this, `Queue`, {
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    })
    this.consumer = new lambda.Function(this, `Consumer`, {
      functionName: `${ns}Consumer`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', '..', 'functions', 'hitcounter')),
      handler: 'consumer.index.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Table.Name,
      },
    })
    this.consumer.addToRolePolicy(new iam.PolicyStatement({
      actions: Table.Actions.ReadWrite,
      resources: Table.getResources(this),
    }))
    
    this.consumer.addEventSource(
      new eventSources.SqsEventSource(this.queue)
    )
    this.queue.grantConsumeMessages(this.consumer)
  }

}