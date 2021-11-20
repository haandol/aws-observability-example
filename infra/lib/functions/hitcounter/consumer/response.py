from typing import Dict


class Response:
    @staticmethod
    def success(body: str) -> Dict:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': body,
        }

    @staticmethod
    def error(code: int, body: str, error_type: str = None) -> Dict:
        return {
            'statusCode': code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Amzn-ErrorType': error_type,
            },
            'body': body,
        }