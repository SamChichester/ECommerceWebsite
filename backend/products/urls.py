from django.urls import path
from .views import category_products, ProductDetail, list_products


urlpatterns = [
    path('', category_products, name='category-products'),
    path('list/', list_products, name='list-products'),
    path('<int:pk>/', ProductDetail.as_view(), name='product-detail'),
]
