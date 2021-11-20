import os
import boto3
from .adapters import DdbUpdateAdapter

table = None


def update_count(path: str) -> int:
    global table
    if not table:
        dynamodb = boto3.resource('dynamodb')
        TableName = os.environ['TABLE_NAME']
        table = dynamodb.Table(TableName)

    updateAdapter = DdbUpdateAdapter(table=table)
    return updateAdapter.update(path)