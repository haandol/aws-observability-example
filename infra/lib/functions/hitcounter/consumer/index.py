import json
from typing import Dict, Any
from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.logging import correlation_paths
from .services import delete_message, update_count
from .response import Response

logger = Logger()
metrics = Metrics()
tracer = Tracer(auto_patch=True)


@tracer.capture_lambda_handler
@logger.inject_lambda_context(
    log_event=True,
    correlation_id_path=correlation_paths.API_GATEWAY_REST
)
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: Dict[str, Any], context: Any):
    for record in event['Records']:
        path = record['body']
        count = update_count(path)
        delete_message(record['receiptHandle'])

    tracer.put_annotation('Path', '/sqs')
    tracer.put_annotation('Method', 'POST')

    return Response.success(body=json.dumps({
        'path': path,
        'count': count,
    }))