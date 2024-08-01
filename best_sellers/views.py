from products.models import Product
from rest_framework.decorators import api_view
from products.serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def home_best_sellers(request):
    top_products = Product.objects.order_by('-times_bought')[:10]
    serialized_data = ProductSerializer(top_products, many=True).data
    return Response(serialized_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def category_best_sellers(request, category_pk):
    top_products = Product.objects.filter(category_id=category_pk).order_by('-times_bought')[:10]
    serialized_data = ProductSerializer(top_products, many=True).data
    return Response(serialized_data, status=status.HTTP_200_OK)
