from rest_framework import viewsets

from .models import Supplier, Purchase
from .serializers import (
    SupplierSerializer,
    PurchaseSerializer,
    PurchaseCreateSerializer,
)


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all().order_by("-created_at")

    def get_serializer_class(self):
        if self.action == "create":
            return PurchaseCreateSerializer
        return PurchaseSerializer