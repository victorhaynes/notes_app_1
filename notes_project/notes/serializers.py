from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note


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