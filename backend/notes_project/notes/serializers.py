from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note

class UserCreateSerializer(serializers.ModelSerializer):
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


# --- CRUD Serializers Below
class NoteReadSerializer(serializers.ModelSerializer):
    """Read serializer for Note model."""
    owner = UserSerializer(read_only=True) # Allows for reading-out the Owner relationship, even though we only call this for responses--read_only prevents accidental setting 
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'owner', 'created_at', 'updated_at']


class NoteWriteSerializer(serializers.ModelSerializer):
    """Write serializer for Note model."""
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault()) # DRF way of setting the current user as the owner of an object

    class Meta:
        model = Note
        fields = ['title', 'content', 'owner']


# class NoteNestedReadSerializer(serializers.ModelSerializer):
#     """
#     Custom: Does not show the owner intentially, only for nesting purpose
#     in UserWithNotesReadSerializer serializer 
#     """
#     class Meta:
#         model = Note
#         fields = ['id', 'title', 'content', 'created_at', 'updated_at']

# class UserWithNotesReadSerializer(serializers.ModelSerializer):
#     """
#     Instead of a list of notes with repeating user object, 
#     return a single user and all of their notes
#     """
#     notes = NoteNestedReadSerializer(many=True, read_only=True)

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'notes']