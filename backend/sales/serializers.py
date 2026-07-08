from rest_framework import serializers
from .models import Sale, SaleItem
from django.db import transaction

class SaleItemCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = SaleItem
    fields = [
      "product",
      "quantity",
    ]

class SaleCreateSerializer(serializers.ModelSerializer):

  sale_items = SaleItemCreateSerializer(source='items', many=True)

  class Meta:
    model = Sale
    fields = [
    "id",
    "created_at",
    "total_amount",
    "sale_items",
    ]

    read_only_fields = [
      "id",
      "created_at",
      "total_amount",
    ]

  @transaction.atomic
  def create(self, validated_data):
    items_data = validated_data.pop("items")

    sale = Sale.objects.create(**validated_data)

    total_amount = 0

    for item in items_data:
      product = item["product"]
      unit_price = product.price
      quantity = item["quantity"]
      
      if quantity > product.stock_quantity:
        raise serializers.ValidationError(
          f"Not enough stock for {product.name}"
      )

      
      line_total = quantity * unit_price

      SaleItem.objects.create(
        sale=sale,
        product=product,
        quantity=quantity,
        unit_price=unit_price,
        line_total=line_total,
      )

      
      product.stock_quantity -= quantity
      product.save()

      total_amount += line_total

    sale.total_amount = total_amount
    sale.save()

    return sale
  
class SaleItemSerializer(serializers.ModelSerializer):
  product_name = serializers.CharField(
    source="product.name",
    read_only=True
  )
  class Meta:
    model = SaleItem
    fields = [
      "id",
      "product",
      "product_name",
      "quantity",
      "unit_price",
      "line_total",
    ]

class SaleSerializer(serializers.ModelSerializer):
  sale_items = SaleItemSerializer(source='items', many=True)

  class Meta:
    model = Sale
    fields = [
      "id",
      "created_at",
      "total_amount",
      "sale_items",
    ]
