from django.db import models
from django.contrib.auth.models import User
from products.models import Product
import secrets


def generate_order_code():
    while True:
        code = secrets.token_hex(3).upper()[:6]
        if not Order.objects.filter(order_code=code).exists():
            return code


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    device_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)

    shipping_name = models.CharField(max_length=255, default='N/A')
    shipping_city = models.CharField(max_length=255, default='N/A')
    shipping_country = models.CharField(max_length=255, default='N/A')
    shipping_line1 = models.CharField(max_length=255, default='N/A')
    shipping_line2 = models.CharField(max_length=255, null=True, blank=True)
    shipping_postal_code = models.CharField(max_length=255, default='N/A')
    shipping_state = models.CharField(max_length=255, default='N/A')

    order_code = models.CharField(max_length=6, unique=True, default=generate_order_code)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def total_price(self):
        return self.quantity * self.price
