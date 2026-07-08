from .models import Sale
from .serializers import SaleSerializer, SaleCreateSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class SaleViewSet(viewsets.ModelViewSet):
  queryset = Sale.objects.all()
  permission_classes = [IsAuthenticated]
  def get_serializer_class(self):
    if self.action == 'create':
      return SaleCreateSerializer
    return SaleSerializer
  