from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Product
from categories.models import Category
from rest_framework.response import Response
from .serializers import ProductSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework import status
import random


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_description = 'page_size'
    max_page_size = 100


@api_view(['GET'])
def category_products(request, category_pk):
    products = Product.objects.filter(category_id=category_pk)
    paginator = ProductPagination()
    result_page = paginator.paginate_queryset(products, request)
    serializer = ProductSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def list_products(request, category_pk):
    products = Product.objects.filter(category_id=category_pk)
    if len(products) >= 10:
        serialized_data = ProductSerializer(products[:10], many=True).data
    else:
        serialized_data = ProductSerializer(products[:5], many=True).data
    return Response(serialized_data, status=status.HTTP_200_OK)


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer

    def get_object(self):
        category_num = self.kwargs['category_pk']
        product_num = self.kwargs['pk']
        return get_object_or_404(Product, category_id=category_num, id=product_num)


@api_view(['GET'])
def random_category_products(request):
    random_category = random.choice(Category.objects.all())
    top_products = Product.objects.filter(category_id=random_category.id).order_by('-times_bought')[:10]
    serialized_data = ProductSerializer(top_products, many=True).data
    return Response({'category': random_category.name, 'data': serialized_data}, status=status.HTTP_200_OK)
