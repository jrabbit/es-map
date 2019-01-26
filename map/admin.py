from django.contrib import admin

# Register your models here.
from .models import Chapter, Event

admin.site.register((Chapter, Event))