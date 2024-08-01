from django.urls import path
from .views import get_order


urlpatterns = [
    path('<str:session_id>/', get_order, name='get-order')
]
