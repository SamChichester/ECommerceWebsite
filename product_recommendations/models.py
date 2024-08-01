from django.db import models
from products.models import Product


class RelatedProducts(models.Model):
    product = models.ForeignKey(Product, related_name='related_products', on_delete=models.CASCADE)
    related_product = models.ForeignKey(Product, related_name='related_to', on_delete=models.CASCADE)
    times_checked_out_together = models.PositiveIntegerField(default=1)
