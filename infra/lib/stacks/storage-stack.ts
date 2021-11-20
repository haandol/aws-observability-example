import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { Table } from '../constants/config'

export class StorageStack extends cdk.Stack {
  public readonly mainTable: dynamodb.Table

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.mainTable = this.createMainTable()
  }

  private createMainTable() {
    const table = new dynamodb.Table(this, 'MainTable', {
      tableName: Table.Name,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED, 
      // TODO: set retain for production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
    return table
  }

}