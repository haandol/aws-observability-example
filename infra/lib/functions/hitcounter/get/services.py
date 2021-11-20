import os
import boto3
from .adapters import DdbFetchAdapter

table = None


def get_count(path: str) -> int:
    global table
    if not table:
        dynamodb = boto3.resource('dynamodb')
        TableName = os.environ['TABLE_NAME']
        table = dynamodb.Table(TableName)

    fetchAdapter = DdbFetchAdapter(table=table)
    return fetchAdapter.fetch(path)