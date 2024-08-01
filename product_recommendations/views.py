from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.authentication import get_authorization_header
import jwt
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from orders.models import Order
from .models import RelatedProducts
from products.serializers import ProductSerializer


@api_view(['GET'])
def recommended_products(request):
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
        return None

    orders = Order.objects.filter(user=user)
    related_products_counts = {}

    for order in orders:
        for item in order.order_items.all():
            related_products_queryset = RelatedProducts.objects.filter(product=item.product)
            for related_product_entry in related_products_queryset:
                related_product = related_product_entry.related_product
                if related_product in related_products_counts:
                    related_products_counts[related_product] += related_product_entry.times_checked_out_together
                else:
                    related_products_counts[related_product] = related_product_entry.times_checked_out_together

    sorted_related_products = sorted(related_products_counts.items(), key=lambda x: x[1], reverse=True)
    related_products = [item[0] for item in sorted_related_products]

    serialized_data = ProductSerializer(related_products[:10], many=True).data

    return Response({'data': serialized_data}, status=status.HTTP_200_OK)
