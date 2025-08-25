from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from ..models import Note
from ..serializers import NoteReadSerializer, NoteWriteSerializer
# Create your views here.

# --- Note CRUD Views
class NoteListCreateAPIView(APIView): 
    """Group get() [mine|all] and post() methods in the List & Create view for Note class"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notes = Note.objects.filter(owner=request.user)
        read_serializer = NoteReadSerializer(notes, many=True)
        return Response(read_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        write_serializer = NoteWriteSerializer(data=request.data, context={'request': request}) # context needed so serializer's "owner = serializers.HiddenField(default=serializers.CurrentUserDefault())"" works
        if write_serializer.is_valid():
            note = write_serializer.save()
            read_serializer = NoteReadSerializer(note)
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response({"serializer_errors": write_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class Test(APIView): 
    """test"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"test": "ok"})


class NoteDetailAPIView(APIView):
    """Group get() [mine&single], put(), patch(), delete() in the Detail view for Note class """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Remember pk comes from the url path '/notes/66', not the request"""
        note = get_object_or_404(Note, pk=pk, owner=request.user)
        read_serializer = NoteReadSerializer(note)
        return Response(read_serializer.data)

    def put(self, request, pk):
        """Total Update"""
        note = get_object_or_404(Note, pk=pk, owner=request.user)
        write_serializer = NoteWriteSerializer(note, data=request.data, context={'request': request})
        if write_serializer.is_valid():
            note = write_serializer.save()
            read_serializer = NoteReadSerializer(note)
            return Response(read_serializer.data, status=status.HTTP_200_OK)
        return Response({"serializer_errors": write_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partial Update"""
        note = get_object_or_404(Note, pk=pk, owner=request.user)
        write_serializer = NoteWriteSerializer(note, data=request.data, partial=True, context={'request': request})
        if write_serializer.is_valid():
            note = write_serializer.save()
            read_serializer = NoteReadSerializer(note)
            return Response(read_serializer.data, status=status.HTTP_200_OK)
        return Response({"serializer_errors": write_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        note = get_object_or_404(Note, pk=pk, owner=request.user)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    

    