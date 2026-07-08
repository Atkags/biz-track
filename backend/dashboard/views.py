from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from sales.models import Sale
from django.utils import timezone
from django.db.models import Sum
from sales.serializers import SaleSerializer
from rest_framework.permissions import IsAuthenticated

class DashboardView(APIView):
  permission_classes = [IsAuthenticated]
  def get(self, request):
    
    products = Product.objects.count()
    today = timezone.now().date()
    sales = Sale.objects.count()
    
    sales_today = Sale.objects.filter(
      created_at__date=today,
    ).count()
    
    revenue_today = Sale.objects.filter(
      created_at__date=today
    ).aggregate(
      total=Sum("total_amount")
    )

    revenue_today = revenue_today["total"] or 0

    low_stock_products = Product.objects.filter(
      stock_quantity__lte=5,
      is_active = True,
    )

    low_stock = []

    for product in low_stock_products:
      low_stock.append({
        "id": product.id,
        "name": product.name,
        "stock_quantity": product.stock_quantity
      })

    recent_sales = Sale.objects.order_by("-created_at")[:5]
    serializer = SaleSerializer(recent_sales, many=True)

    return Response({
      "products": products,
      "sales": sales,
      "sales_today": sales_today,
      "revenue_today": revenue_today,
      "low_stock": low_stock,
      "recent_sales": serializer.data,
    })