import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { HttpApi } from '../constructs/httpapi'
import { IHttpApi2 } from '../interfaces/interface'
import { App } from '../constants/config'

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: IHttpApi2
  public readonly authorizer: apigwv2.IHttpRouteAuthorizer

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const httpApi = new HttpApi(this, `HttpApi`)
    this.api = httpApi

    new cdk.CfnOutput(this, `HttpApiUrl`, {
      exportName: `${App.Context.Namespace}HttpApiUrl`,
      value: `${httpApi.api.url}` || 'undefined',
    })
  }

}
