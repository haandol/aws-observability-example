import os
import boto3
from aws_lambda_powertools import Tracer
from .adapters import DdbUpdateAdapter

tracer = Tracer()
table = None


@tracer.capture_method
def update_count(path: str) -> int:
    global table
    if not table:
        dynamodb = boto3.resource('dynamodb')
        TableName = os.environ['TABLE_NAME']
        table = dynamodb.Table(TableName)

    updateAdapter = DdbUpdateAdapter(table=table)
    return updateAdapter.update(path)