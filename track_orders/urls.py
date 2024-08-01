from django.urls import path
from .views import track_order, my_orders


urlpatterns = [
    path('my-orders/', my_orders, name='my-orders'),
    path('<str:code>/', track_order, name='track-order'),
]
