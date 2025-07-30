from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    # repersent User instance via __str__ methood (username by default)
    owner = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'owner', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'notes']