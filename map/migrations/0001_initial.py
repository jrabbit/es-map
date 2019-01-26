# Generated by Django 2.1.5 on 2019-01-26 00:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=1024)),
                ('page_url', models.URLField()),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('logo_url', models.URLField(blank=True, null=True)),
            ],
            options={
                'db_table': 'es_chapter',
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=480)),
                ('description', models.TextField()),
                ('datetime', models.DateTimeField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('page_url', models.URLField()),
                ('chapter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='map.Chapter')),
            ],
            options={
                'db_table': 'es_event',
            },
        ),
    ]