# Generated by Django 4.2.13 on 2024-07-16 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_remove_product_is_available_product_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='times_bought',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
