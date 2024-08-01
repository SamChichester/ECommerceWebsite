from django.urls import path
from .views import UserListCreate, UserDetail, LogoutView, RegisterView


urlpatterns = [
    path('', UserListCreate.as_view(), name='user-list-create'),
    path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]
