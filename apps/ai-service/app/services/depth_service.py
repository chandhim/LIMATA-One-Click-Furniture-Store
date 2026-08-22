from app.core.exceptions import NotImplementedException
from app.models.requests import DepthRequest
from app.models.responses import DepthResponse


class DepthService:
    def __init__(self):
        pass

    def initialize(self):
        raise NotImplementedException("Depth model loading is not implemented yet.")

    def estimate_depth(self, request: DepthRequest) -> DepthResponse:
        raise NotImplementedException("Depth estimation inference is not implemented yet.")

    def shutdown(self):
        raise NotImplementedException("Depth service shutdown is not implemented yet.")
