from django.conf import settings
from products.serializers import ProductSerializer
from products.models import Product
from .models import Cart as CartModel, CartItem
from django.contrib.auth.models import User
from rest_framework.authentication import get_authorization_header
import jwt


class Cart:
    def __init__(self, request):
        self.session = request.session
        self.user = self._get_user(request)
        self.device_id = request.device_id
        self.cart = self._get_cart()

    def _get_cart(self):
        if self.user:
            cart, created = CartModel.objects.get_or_create(user=self.user)
        else:
            cart, created = CartModel.objects.get_or_create(device_id=self.device_id)
        return cart

    def _get_user(self, request):
        """Having problems accessing request.user. This is an alternative way."""
        auth_header = get_authorization_header(request)
        try:
            auth_token = auth_header.decode('utf-8').split()[1]
        except IndexError:
            return None
        payload = jwt.decode(auth_token, settings.SECRET_KEY, algorithms=['HS256'])

        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
        return user

    def __iter__(self):
        for item in self.cart.cart_items.all():
            yield {
                'product': ProductSerializer(item.product).data,
                'quantity': item.quantity,
                'price': item.price,
                'total_price': item.total_price()
            }

    def save(self):
        self.cart.save()

    def add(self, product, quantity=1, override_quantity=False):
        product_instance = Product.objects.get(id=product['id'])

        item, created = CartItem.objects.get_or_create(
            cart=self.cart,
            product=product_instance,
            price=float(product['price'])
        )
        if created or override_quantity:
            item.quantity = quantity
        else:
            item.quantity += quantity

        product_instance.stock_number -= item.quantity
        product_instance.save()
        item.save()
        self.save()

    def remove(self, product):
        product_instance = Product.objects.get(id=product['id'])
        item, created = CartItem.objects.get_or_create(
            cart=self.cart,
            product=product_instance,
            price=float(product_instance.price)
        )
        product_instance.stock_number += item.quantity
        item.delete()
        product_instance.save()
        self.save()

    def get_total_price(self):
        return sum(item.total_price() for item in self.cart.cart_items.all())

    def clear(self):
        self.cart.cart_items.all().delete()
        self.save()
