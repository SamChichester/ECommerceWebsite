from django.core.management.base import BaseCommand
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl import Index
from ...documents import ProductDocument
from products.models import Product


class Command(BaseCommand):
    help = 'Indexes all products to Elasticsearch'

    def handle(self, *args, **kwargs):
        es = connections.get_connection()
        self.stdout.write('Connected to Elasticsearch')

        index = Index(ProductDocument._index._name)
        if not index.exists(using=es):
            index.create(using=es)
            self.stdout.write(self.style.SUCCESS('Created index for products'))

        qs = Product.objects.all()
        for product in qs:
            doc = ProductDocument(
                meta={'id': product.id},
                id=product.id,
                name=product.name,
                image=product.image,
                description=product.description,
                price=product.price,
                stock_number=product.stock_number,
                category={
                    'id': product.category.id,
                    'name': product.category.name,
                }
            )
            doc.save(using=es)
            self.stdout.write(self.style.SUCCESS(f'Indexed product {product.id}'))

        self.stdout.write(self.style.SUCCESS('Successfully indexed all products!'))
