from django.test import TestCase, Client
from django.contrib.auth.models import User
from products.models import Product, Category
from .models import Cart, CartItem


class CartTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')

        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product', price=10.0, category=self.category)
        self.cart = Cart.objects.create(user=self.user)

    def test_add_to_cart(self):
        response = self.client.post(f'/api/cart/{self.cart.id}/add_item/', {'product_id': self.product.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['product'], self.product.id)

    def test_remove_from_cart(self):
        self.client.post(f'/api/cart/{self.cart.id}/add_item/', {'product_id': self.product.id})
        cart_item = CartItem.objects.get(cart=self.cart, product=self.product)

        response = self.client.post(f'/api/cart/{self.cart.id}/remove_item/', {'product_id': self.product.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'item removed')
        with self.assertRaises(CartItem.DoesNotExist):
            CartItem.objects.get(id=cart_item.id)
