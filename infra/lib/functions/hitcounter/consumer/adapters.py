from abc import ABC, abstractmethod
from typing import Protocol, Callable


class UpdateTable(Protocol):
    update_item: Callable


class DeleteQueue(Protocol):
    delete_messages: Callable


class DdbAdapter(ABC):
    @abstractmethod
    def update(self, path: str) -> int:
        """return hitCount for the given path"""


class SqsAdapter(ABC):
    @abstractmethod
    def delete(self, path: str) -> int:
        """delete message from sqs"""


class DdbUpdateAdapter(DdbAdapter):
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


class SqsUpdateAdapter(SqsAdapter):
    def __init__(self, queue: DeleteQueue):
        self.queue = queue

    def delete(self, receiptHandle: str):
        self.queue.delete_messages(Entries=[
            {'Id': '1', 'ReceiptHandle': receiptHandle},
        ])
        return