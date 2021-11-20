import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations'
import {
  IHttpApi2, ILambdaRouteProps, IIntegRouteProps,
} from '../interfaces/interface'

import { App } from '../constants/config'

export class HttpApi extends cdk.Construct implements IHttpApi2 {
  public readonly api: apigwv2.HttpApi

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    this.api = this.createHttpApi()
  }

  public addRoute(props: ILambdaRouteProps): apigwv2.HttpRoute {
    const routeKey = props.path ? apigwv2.HttpRouteKey.with(props.path, props.method) : apigwv2.HttpRouteKey.DEFAULT
    const integration = new integrations.LambdaProxyIntegration({ handler: props.handler })
    return new apigwv2.HttpRoute(props.scope, `${props.routeId}Route`, {
      httpApi: this.api,
      routeKey,
      integration,
    })
  }

  public addIntegration(props: IIntegRouteProps): apigwv2.CfnRoute {
    const routeKey = props.path ? apigwv2.HttpRouteKey.with(props.path, props.method) : apigwv2.HttpRouteKey.DEFAULT
    return new apigwv2.CfnRoute(props.scope, `${props.routeId}Route`, {
      apiId: this.api.apiId,
      routeKey: routeKey.key,
      target: `integrations/${props.integration.ref}`,
    })
  }

  private createHttpApi(): apigwv2.HttpApi {
    return new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: `${App.Context.Namespace}HttpApi`,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    })
  }

}
