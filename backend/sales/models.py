from django.db import models
from products.models import Product

class Sale(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  total_amount = models.DecimalField(decimal_places=2, max_digits=10)

class SaleItem(models.Model):
  sale_id = models.ForeignKey(
    Sale,
    on_delete=models.CASCADE,
    related_name="items"
  )
  product = models.ForeignKey(
    Product,
    on_delete = models.CASCADE,
  )
  quantity = models.PositiveIntegerField()
  unit_price = models.DecimalField(decimal_places=2, max_digits=10)
  line_total = models.DecimalField(decimal_places=2, max_digits=10)