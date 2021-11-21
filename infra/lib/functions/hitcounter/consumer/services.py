import os
import boto3
from .adapters import DdbUpdateAdapter, SqsUpdateAdapter
from aws_lambda_powertools import Tracer

tracer = Tracer()
table = None
queue = None


@tracer.capture_method
def update_count(path: str) -> int:
    global table
    if not table:
        dynamodb = boto3.resource('dynamodb')
        TableName = os.environ['TABLE_NAME']
        table = dynamodb.Table(TableName)

    updateAdapter = DdbUpdateAdapter(table=table)
    return updateAdapter.update(path)


@tracer.capture_method
def delete_message(receiptHandle: str) -> None:
    global queue
    if not queue:
        sqs = boto3.resource('sqs')
        queue = sqs.Queue(os.environ['QUEUE_URL'])

    updateAdapter = SqsUpdateAdapter(queue=queue)
    return updateAdapter.delete(receiptHandle)