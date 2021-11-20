import json
from typing import Dict, Any
from .services import get_count
from .response import Response


def handler(event: Dict[str, Any], context: Any):
    print(json.dumps(event))

    path = event['pathParameters']['proxy']
    if not path:
        return Response.error(
            400, body='no path given', error_type='BadRequest'
        )

    count = get_count(path)
    return Response.success(body=json.dumps({
        'path': path,
        'count': count,
    }))