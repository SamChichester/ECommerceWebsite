import uuid


class DeviceIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        device_id = request.headers.get('Device-ID')
        if not device_id:
            device_id = str(uuid.uuid4())

        request.device_id = device_id

        response = self.get_response(request)

        if 'device_id' not in request.COOKIES:
            response.set_cookie(
                'device_id', device_id, httponly=True, samesite='Lax', secure=False, domain='localhost', path='/'
            )

        return response
