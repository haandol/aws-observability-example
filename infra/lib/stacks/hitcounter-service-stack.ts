import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { HitCounterService } from '../constructs/services/hitcounter'
import { IHttpApi2 } from '../interfaces/interface'

interface Props extends cdk.StackProps {
  api: IHttpApi2
}

export class HitcounterServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props)

    const service = new HitCounterService(this, `HitCounterService`)
    props.api.addRoute({
      scope: this,
      routeId: `GetCount`,
      path: '/{proxy+}',
      method: apigwv2.HttpMethod.GET,
      handler: service.getCount,
    })
    props.api.addRoute({
      scope: this,
      routeId: `UpdateCount`,
      path: '/{proxy+}',
      method: apigwv2.HttpMethod.POST,
      handler: service.updateCount,
    })

    const role = new iam.Role(this, `HitCounterServiceRole`, {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),
      ],
    })
    const integ = new apigwv2.CfnIntegration(this, `SumCountInteg`, {
      apiId: props.api.api.apiId,
      integrationType: 'AWS_PROXY',
      integrationSubtype: 'SQS-SendMessage',
      payloadFormatVersion: '1.0',
      credentialsArn: role.roleArn,
      requestParameters: {
        QueueUrl: `${service.queue.queueUrl}`,
        MessageBody: '$request.body.message',
      },
    })
    props.api.addIntegration({
      scope: this,
      routeId: `SumCount`,
      path: '/sum/{proxy+}',
      method: apigwv2.HttpMethod.POST,
      integration: integ,
    })
  }

}
