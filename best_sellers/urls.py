from django.urls import path
from .views import category_best_sellers, home_best_sellers


urlpatterns = [
    path('', home_best_sellers, name='home-best-sellers'),
    path('<category_pk>/', category_best_sellers, name='category-best-sellers')
]
