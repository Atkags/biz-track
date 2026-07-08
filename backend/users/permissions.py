from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
  def has_permission(self, request, view):
    return request.user.groups.filter(name="Admin").exists()
  
class IsCashier(BasePermission):
  def has_permission(self, request, view):
    return request.user.groups.filter(name="Cashier").exists()