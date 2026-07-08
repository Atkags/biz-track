from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from sales.models import Sale, SaleItem
from django.utils import timezone
from django.db.models import Sum
from sales.serializers import SaleSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import date
from django.db.models.functions import TruncMonth
from purchases.models import Purchase

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
      stock_quantity__lte=10,
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
  
class ReportView(APIView):
  permission_classe = [IsAuthenticated]

  def get(self, request):
    today_sales = (
      Sale.objects.filter(created_at__date=date.today())
      .aggregate(total=Sum("total_amount"))
      )

    today_sales = today_sales["total"] or 0 

    month_sales = (
      Sale.objects.filter(
        created_at__year=date.today().year,
        created_at__month=date.today().month,
      ).aggregate(total=Sum("total_amount"))
    )

    month_sales = month_sales["total"] or 0

    month_purchases = (
      Purchase.objects.filter(
        created_at__year=date.today().year,
        created_at__month=date.today().month,
      ).aggregate(total=Sum("total_amount"))
    )

    month_purchases = month_purchases["total"] or 0

    low_stock = Product.objects.filter(stock_quantity__lt=10)

    best_selling = (
      SaleItem.objects.values("product__name")
      .annotate(quantity_sold=Sum("quantity"))
      .order_by("-quantity_sold")[:5]
      )
    
    return Response({
      "today_sales": today_sales,
      "month_sales": month_sales,
      "month_purchases": month_purchases,
      "best_selling": best_selling,
      "low_stock": [
          {
              "name": p.name,
              "stock": p.stock_quantity,
          }
          for p in low_stock
      ],
    })