from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, PurchaseViewSet

router = DefaultRouter()

router.register("suppliers", SupplierViewSet)
router.register("purchases", PurchaseViewSet)

urlpatterns = router.urls