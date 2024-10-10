from rest_framework.response import Response
from rest_framework import status

class ApiResponse:
    @staticmethod
    def success(data=None, status_code=status.HTTP_200_OK):
        return Response({
            "status_code": status_code,
            "data": data,
            "errors": None
        }, status=status_code)

    @staticmethod
    def error(message, error_code, description=None, status_code=status.HTTP_400_BAD_REQUEST):
        return Response({
            "status_code": status_code,
            "data": None,
            "errors": [
                {
                    "error": error_code,
                    "description": description if description else "An error occurred.",
                    "message": message
                }
            ]
        }, status=status_code)