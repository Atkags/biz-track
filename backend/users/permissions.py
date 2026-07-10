from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="Admin").exists()
        )


class IsCashier(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="Cashier").exists()
        )


class IsAdminOrCashier(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name__in=["Admin", "Cashier"]
            ).exists()
        )

class IsAdminOrReadOnly(BasePermission):
  def has_permission(self, request, view):
    if request.method in SAFE_METHODS:
      return request.user.is_authenticated

    return request.user.groups.filter(name="Admin").exists()