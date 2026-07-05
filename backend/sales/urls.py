from django.urls import path, include
from .views import SaleViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sales', SaleViewSet)
urlpatterns = [
  path('', include(router.urls))
]