#!/usr/bin/env node

import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ApiGatewayStack } from '../lib/stacks/apigateway-stack'
import { StorageStack } from '../lib/stacks/storage-stack'
import { HitcounterServiceStack } from '../lib/stacks/hitcounter-service-stack'
import { App } from '../lib/constants/config'

const app = new cdk.App()

const ns = App.Context.Namespace

new StorageStack(app, `${ns}StorageStack`)
const apiGatewayStack = new ApiGatewayStack(app, `${ns}ApiGatewayStack`)
const hitcounterStack = new HitcounterServiceStack(app, `${ns}HitcounterServiceStack`, {
  api: apiGatewayStack.api,
})
hitcounterStack.addDependency(apiGatewayStack)