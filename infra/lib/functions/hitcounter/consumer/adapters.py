from abc import ABC, abstractmethod
from typing import Protocol, Callable


class UpdateTable(Protocol):
    update_item: Callable


class UpdateAdapter(ABC):
    @abstractmethod
    def update(self, path: str) -> int:
        """return hitCount for the given path"""


class DdbUpdateAdapter(UpdateAdapter):
    def __init__(self, table: UpdateTable):
        self.table = table

    def update(self, path: str) -> int:
        resp = self.table.update_item(
            Key={ 'PK': path },
            UpdateExpression='ADD hitCount :v',
            ExpressionAttributeValues={
                ':v': 1
            },
            ReturnValues='UPDATED_NEW',
        )
        return int(resp['Attributes']['hitCount'])