from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_interface, name='chat'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
]
