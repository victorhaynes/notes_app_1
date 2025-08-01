from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from ..models import Note
from ..serializers import NoteSerializer, UserSerializer, UserWithNotesSerializer
# Create your views here.


# --- Note Views ---
# --- Note Views ---
# --- Note Views ---
class NoteListView(APIView):

    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(instance=notes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([permissions.IsAuthenticated])
# def note_detail(request, pk):
#     try:
#         note = Note.objects.get(pk=pk, owner=request.user)
#     except Note.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':
#         serializer = NoteSerializer(note)
#         return Response(serializer.data)
    
#     elif request.method == 'PUT':
#         serializer = NoteSerializer(note, data=request.data)
#         if serializer.is_valid():
#             serializer.save(owner=request.user)
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     elif request.method == 'DELETE':
#         note.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# # --- User Views ---
# # --- User Views ---
# # --- User Views ---
# @api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
# def user_list(request):
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)


# @api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
# def user_detail(request, pk):
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     serializer = UserSerializer(user)
#     return Response(serializer.data)