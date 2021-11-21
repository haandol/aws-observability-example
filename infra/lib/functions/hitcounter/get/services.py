import os
import boto3
from .adapters import DdbFetchAdapter
from aws_lambda_powertools import Tracer

tracer = Tracer()
table = None


@tracer.capture_method
def get_count(path: str) -> int:
    global table
    if not table:
        dynamodb = boto3.resource('dynamodb')
        TableName = os.environ['TABLE_NAME']
        table = dynamodb.Table(TableName)

    fetchAdapter = DdbFetchAdapter(table=table)
    return fetchAdapter.fetch(path)