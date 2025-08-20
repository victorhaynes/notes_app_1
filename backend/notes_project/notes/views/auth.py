from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..serializers import UserCreateSerializer, UserSerializer, ChangePasswordSerializer, ResetPasswordSerializer
from typing import cast


class RegisterView(APIView):
    # Disables X-CSRFToken header check. 
    authentication_classes = []

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"serializer_errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    def get(self, request):
        # user.is_authenticated takes a user object and uses the session to check if the user is logged in
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"user": "Not logged in."}, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    # Disables X-CSRFToken header check. 
    # This hanldes edge case where user is already logged in and tries to log in again.
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user) # Serialize the user, expose UI necessary fields
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)


class LogOutView(APIView):
    """By default requires CSRF token for post method. logout() relies on a cookie in request."""
    def post(self, request): # By convention use post method not delete
        print(request)
        logout(request)
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """Password is known scenario."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
        
            if user.check_password(old_password):
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successful.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"serializer_errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordview(APIView):
    """
    Password is unknown scenario.
    For this simple scenario a username & email is sufficient to reset your password
    """
    authentication_classes = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['username'], 
                                    email=serializer.validated_data['email'])
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful. Login with new password.'}, status=status.HTTP_200_OK)
        return Response({"serializer_errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

