# Generated by Django 4.2.13 on 2024-07-14 21:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0003_remove_product_is_available_product_image_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RelatedProducts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('times_checked_out_together', models.PositiveIntegerField(default=1)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_products', to='products.product')),
                ('related_product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_to', to='products.product')),
            ],
        ),
    ]