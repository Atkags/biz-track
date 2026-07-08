from rest_framework import serializers
from django.db import transaction

from .models import Supplier, Purchase, PurchaseItem


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class PurchaseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseItem
        fields = ["product", "quantity"]


class PurchaseCreateSerializer(serializers.ModelSerializer):
    purchase_items = PurchaseItemSerializer(source="items", many=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "supplier",
            "created_at",
            "total_amount",
            "purchase_items",
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        purchase = Purchase.objects.create(
            **validated_data,
            total_amount=0
        )

        total_amount = 0

        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]

            unit_price = product.price
            line_total = quantity * unit_price

            PurchaseItem.objects.create(
                purchase=purchase,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                line_total=line_total,
            )

            product.stock_quantity += quantity
            product.save()

            total_amount += line_total

        purchase.total_amount = total_amount
        purchase.save()

        return purchase
    
class PurchaseHistoryItemSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source="product.name")

    class Meta:
        model = PurchaseItem
        fields = [
            "product",
            "quantity",
            "unit_price",
            "line_total",
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(source="supplier.name")
    purchase_items = PurchaseHistoryItemSerializer(source="items", many=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "supplier",
            "created_at",
            "total_amount",
            "purchase_items",
        ]