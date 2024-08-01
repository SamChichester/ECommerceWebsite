from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
from django.shortcuts import get_object_or_404


class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'category_pk'
    serializer_class = CategorySerializer

    def get_object(self):
        category_num = self.kwargs['category_pk']
        return get_object_or_404(Category, id=category_num)
