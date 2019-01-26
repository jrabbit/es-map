from django.db import models

# Create your models here.


class Chapter(models.Model):
    location = models.CharField(max_length=1024)
    page_url = models.URLField()
    # coords
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    logo_url = models.URLField(null=True, blank=True)
    # country = models.ForeignKey("Country", on_delete=models.CASCADE)

    class Meta:
        db_table = "es_chapter"

    def __str__(self):
        return self.location        
class Event(models.Model):
    name = models.CharField(max_length=480)
    description = models.TextField()
    datetime = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    page_url = models.URLField()
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)

    class Meta:
        db_table = "es_event"

    def __str__(self):
        return self.name
