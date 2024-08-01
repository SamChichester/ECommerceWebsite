from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .service import Cart


class CartAPI(APIView):
    def get(self, request, format=None):
        cart = Cart(request)

        return Response(
            {
                'data': list(iter(cart)),
                'cart_total_price': cart.get_total_price()
            },
            status=status.HTTP_200_OK
        )

    def post(self, request, **kwargs):
        cart = Cart(request)
        action = request.data.get('action', '')

        if action == 'remove':
            product = request.data['product']
            cart.remove(product)

        elif action == 'clear':
            cart.clear()

        elif action == 'add':
            print(request.data)
            product = request.data['product']
            quantity = request.data.get('quantity', 1)
            override_quantity = request.data.get('override_quantity', False)
            cart.add(product=product, quantity=quantity, override_quantity=override_quantity)

        else:
            return Response(
                {'error': 'Invalid action'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {'message': 'cart updated'},
            status=status.HTTP_202_ACCEPTED
        )
