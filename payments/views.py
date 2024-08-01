import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from cart.service import Cart

stripe.api_key = settings.STRIPE_SECRET_KEY


@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        DOMAIN = 'http://localhost:3000'
        try:
            data = json.loads(request.body)
            device_id = request.COOKIES.get('device_id')

            cart = Cart(request)
            line_items = []

            for item in list(iter(cart)):

                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': item['product']['name'],
                        },
                        'unit_amount': int(float(item['price']) * 100),
                    },
                    'quantity': item['quantity'],
                })

            metadata = {
                'cart_id': cart.cart.id,
            }
            if device_id:
                metadata['device_id'] = device_id

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=f"{DOMAIN}/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=DOMAIN + '/cart',
                metadata=metadata,
                shipping_address_collection={
                  'allowed_countries': ['US', 'CA'],
                },
                billing_address_collection='required',
            )

            return JsonResponse({'id': checkout_session.id, 'url': checkout_session.url})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
