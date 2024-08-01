from .models import Order, OrderItem
from cart.models import Cart
from product_recommendations.models import RelatedProducts
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return JsonResponse({'status': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({'status': 'Invalid signature'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)

    return JsonResponse({'status': 'Success'}, status=200)


def handle_checkout_session(session):
    metadata = session.get('metadata')
    shipping_details = session.get('shipping_details')

    cart_id = metadata.get('cart_id')
    device_id = metadata.get('device_id')

    cart = Cart.objects.get(id=cart_id)
    cart_items = cart.cart_items.all()
    user = cart.user

    for item in cart_items:
        item.product.times_bought += 1
        item.product.save()

    # Add related products
    for i in range(len(cart_items)):
        for j in range(i + 1, len(cart_items)):
            product_a = cart_items[i].product
            product_b = cart_items[j].product

            if product_a != product_b:
                related_product_entry, created = RelatedProducts.objects.get_or_create(
                    product=product_a,
                    related_product=product_b,
                    defaults={'times_checked_out_together': 1}
                )
                if not created:
                    related_product_entry.times_checked_out_together += 1
                    related_product_entry.save()

                # Do the same for the reverse relationship
                related_product_entry, created = RelatedProducts.objects.get_or_create(
                    product=product_b,
                    related_product=product_a,
                    defaults={'times_checked_out_together': 1}
                )
                if not created:
                    related_product_entry.times_checked_out_together += 1
                    related_product_entry.save()

    # Create order
    order = Order.objects.create(
        user=user,
        device_id=device_id,
        total_price=session['amount_total'] / 100,
        stripe_session_id=session['id'],

        shipping_name=shipping_details['name'],
        shipping_city=shipping_details['address']['city'],
        shipping_country=shipping_details['address']['country'],
        shipping_line1=shipping_details['address']['line1'],
        shipping_line2=shipping_details['address']['line2'],
        shipping_postal_code=shipping_details['address']['postal_code'],
        shipping_state=shipping_details['address']['state']
    )

    # Add cart items as order items
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.price
        )

    cart.cart_items.all().delete()


def get_order(request, session_id):
    order = get_object_or_404(Order, stripe_session_id=session_id)
    order_items = order.order_items.all()

    order_data = {
        'id': order.id,
        'total_price': order.total_price,
        'items': [
            {
                'id': item.id,
                'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                },
                'quantity': item.quantity,
                'price': item.price,
            }
            for item in order_items
        ],
        'shipping_city': order.shipping_city,
        'shipping_line1': order.shipping_line1,
        'shipping_postal_code': order.shipping_postal_code,
        'order_code': order.order_code,
        'created_at': order.created_at
    }

    return JsonResponse(order_data)
