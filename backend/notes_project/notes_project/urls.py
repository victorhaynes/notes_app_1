"""
URL configuration for notes_project project.

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
from django.urls import path
from notes.views import views, auth

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', auth.RegisterView.as_view(), name='register'),
    path('api/auth/login/', auth.LoginView.as_view(), name='login'),
    path('api/auth/logout/', auth.LogOutView.as_view(), name='logout'),
    path('api/auth/password-change/', auth.ChangePasswordView.as_view(), name='logout'),
    path('api/auth/password-reset/', auth.ResetPasswordview.as_view(), name='logout'),
    path('api/auth/me/', auth.MeView.as_view(), name='me'),
    path('api/notes/', views.NoteListView.as_view(), name='note-list'),
    # path('api/notes/<int:pk>/', views.note_detail, name='note-detail'),
    # path('api/users/', views.user_list, name='user-list'),
    # path('api/users/<int:pk>/', views.user_detail, name='user-detail'),
]
