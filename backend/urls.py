"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from orders.views import stripe_webhook
from searchbar.views import search
from product_recommendations.views import recommended_products
from products.views import random_category_products

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('payments.urls')),
    path('api/users/', include('users.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/categories/<int:category_pk>/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/orders/', include('orders.urls')),
    path('api/webhook/', stripe_webhook, name='stripe-webhook'),
    path('api/search/', search, name='search'),
    path('api/track-orders/', include('track_orders.urls')),
    path('api/recommended-products/', recommended_products, name='recommended-products'),
    path('api/best-sellers/', include('best_sellers.urls')),
    path('api/random-category-products/', random_category_products, name='random-category-products')
]
