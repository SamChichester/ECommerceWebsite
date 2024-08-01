from django.db import models
from categories.models import Category


class Product(models.Model):
    name = models.CharField(max_length=100)
    image = models.URLField(max_length=200, default='')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_number = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    times_bought = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
