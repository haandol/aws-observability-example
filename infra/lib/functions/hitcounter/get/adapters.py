from abc import ABC, abstractmethod
from typing import Protocol, Callable
from aws_lambda_powertools import Tracer

tracer = Tracer()


class FetchTable(Protocol):
    get_item: Callable


class FetchAdapter(ABC):
    @abstractmethod
    def fetch(self, path: str) -> int:
        """return hitCount for the given path"""


class DdbFetchAdapter(FetchAdapter):
    def __init__(self, table: FetchTable):
        self.table = table

    @tracer.capture_method
    def fetch(self, path: str) -> int:
        resp = self.table.get_item(
            Key={ 'PK': path },
        )
        if 'Item' in resp:
            return int(resp['Item']['hitCount'])
        else:
            return 0