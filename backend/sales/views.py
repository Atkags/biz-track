from .models import Sale
from .serializers import SaleSerializer, SaleCreateSerializer
from rest_framework import viewsets
from users.permissions import IsAdminOrCashier

class SaleViewSet(viewsets.ModelViewSet):
  queryset = Sale.objects.all()
  permission_classes = [IsAdminOrCashier]
  def get_serializer_class(self):
    if self.action == 'create':
      return SaleCreateSerializer
    return SaleSerializer
  