from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        """
        Overwrite the create method, .create_user() method hashes the password.
        Necessary for auth to work properly with built in functions like authenticate() and login().
        """
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    new_password = serializers.CharField(write_only=True)



class UserSerializer(serializers.ModelSerializer): 
    """Base serializer for User model. Used to include user information in NoteSerializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class NoteSerializer(serializers.ModelSerializer):
    """Base serializer for Note model."""
    owner = UserSerializer(read_only=True) # where the foreign key is
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'owner', 'created_at', 'updated_at']


class UserWithNotesSerializer(serializers.ModelSerializer):
    """Serializer for User model with related Notes"""
    notes = NoteSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'notes']