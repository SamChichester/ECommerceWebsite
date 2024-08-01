from django.http import JsonResponse
from elasticsearch_dsl import Q
from .documents import ProductDocument


def search(request):
    query = request.GET.get('q', '')
    if query:
        search_query = Q('wildcard', name=f'*{query}*')
        search = ProductDocument.search().query(search_query)
        response = search.execute()
        results = [
            {
                'id': hit.meta.id,
                'name': hit.name,
                'image': hit.image,
                'description': hit.description,
                'price': hit.price,
                'stock_number': hit.stock_number,
                'category': hit.category.to_dict() if hit.category else None,
            }
            for hit in response
        ]
    else:
        results = []
    return JsonResponse(results, safe=False)
