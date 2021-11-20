import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'

export interface ILambdaRouteProps {
  scope: cdk.Construct
  path?: string
  routeId: string
  method: apigwv2.HttpMethod
  handler: lambda.IFunction
}

export interface IIntegRouteProps {
  scope: cdk.Construct
  path?: string
  routeId: string
  method: apigwv2.HttpMethod
  integration: apigwv2.CfnIntegration
}

export interface IHttpApi2 {
  api: apigwv2.IHttpApi
  authorizer?: apigwv2.IHttpRouteAuthorizer
  addRoute: (props: ILambdaRouteProps) => apigwv2.IHttpRoute
  addIntegration: (props: IIntegRouteProps) => apigwv2.CfnRoute
}