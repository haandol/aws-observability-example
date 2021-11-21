import json
from typing import Dict, Any
from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.logging import correlation_paths
from .services import get_count
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
    path = event['pathParameters']['proxy']
    if not path:
        logger.warn('bad request because of no path')
        return Response.error(
            400, body='no path given', error_type='BadRequest'
        )

    httpContext = event['requestContext']['http']
    tracer.put_annotation('Path', httpContext['path'])
    tracer.put_annotation('Method', httpContext['method'])

    count = get_count(path)
    return Response.success(body=json.dumps({
        'path': path,
        'count': count,
    }))