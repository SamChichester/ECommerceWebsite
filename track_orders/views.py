from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from orders.models import Order, OrderItem
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authentication import get_authorization_header
import jwt
from django.conf import settings
from rest_framework import status


@api_view(['GET'])
def track_order(request, code):
    order = get_object_or_404(Order, order_code=code)

    order_items = order.order_items.all()

    order_data = {
        'id': order.id,
        'total_price': order.total_price,
        'items': [
            {
                'id': item.id,
                'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                },
                'quantity': item.quantity,
                'price': item.price,
            }
            for item in order_items
        ],
        'shipping_city': order.shipping_city,
        'shipping_line1': order.shipping_line1,
        'shipping_postal_code': order.shipping_postal_code,
        'order_code': order.order_code,
        'created_at': order.created_at
    }

    return JsonResponse(order_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def my_orders(request):
    auth_header = get_authorization_header(request)
    try:
        auth_token = auth_header.decode('utf-8').split()[1]
    except IndexError:
        return None
    payload = jwt.decode(auth_token, settings.SECRET_KEY, algorithms=['HS256'])

    user_id = payload['user_id']
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    orders = Order.objects.filter(user=user)

    order_list = []
    for order in orders:
        order_data = {
            'id': order.id,
            'total_price': order.total_price,
            'items': [
                {
                    'id': item.id,
                    'product': {
                        'id': item.product.id,
                        'name': item.product.name,
                    },
                    'quantity': item.quantity,
                    'price': item.price,
                }
                for item in OrderItem.objects.filter(order=order)
            ],
            'shipping_city': order.shipping_city,
            'shipping_line1': order.shipping_line1,
            'shipping_postal_code': order.shipping_postal_code,
            'order_code': order.order_code,
            'created_at': order.created_at
        }
        order_list.append(order_data)

    order_dict = {'data': order_list}
    return JsonResponse(order_dict, status=status.HTTP_200_OK)
