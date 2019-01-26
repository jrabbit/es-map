from django.shortcuts import render
from rest_framework import generics, viewsets
# Create your views here.
from .serializers import *
from .models import *

class ChapterAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

class EventAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
