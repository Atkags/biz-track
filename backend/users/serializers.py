from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        groups = self.user.groups.values_list("name", flat=True)

        data["role"] = groups[0] if groups else None

        return data