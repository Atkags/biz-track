from .models import Sale
from .serializers import SaleSerializer
from rest_framework import viewsets

class SaleViewSet(viewsets.ModelViewSet):
  queryset = Sale.objects.all()
  serializer_class = SaleSerializer
