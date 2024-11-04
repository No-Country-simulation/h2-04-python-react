from rest_framework import serializers
from core.models import User, Token, Players
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username:
            raise serializers.ValidationError("El identificador no puede estar vacío.")

        # Intentar autenticar por correo (asumiendo que el username es el correo)
        user = authenticate(username=username, password=password)
        if user is None:
            try:
                # Busca el usuario por teléfono
                user = User.objects.get(phone=username)
                # Validar la contraseña
                if not user.check_password(password):
                    raise serializers.ValidationError("Credenciales inválidas.")
            except User.DoesNotExist:
                raise serializers.ValidationError("Credenciales inválidas.")

        attrs['user'] = user
        return attrs




class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['full_name' , 'email', 'password', 'password2', 'phone','profile_image' ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("The passwords do not match.")
    
        username = data['email']
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        phone = data['phone']
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError("A user with that phone already exists.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data['phone'],
            profile_image=validated_data.get('profile_image')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    total_points = serializers.SerializerMethodField()
    rewards_points = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False,required=False)

    class Meta:
        model = User
        fields = ['id','full_name', 'email', 'phone', 'profile_image', 'type_user','total_points', 'rewards_points','is_superuser']

    def get_total_points(self, obj):
        # Retorna la suma de total_points y rewards_points
        return (obj.total_points or 0) + (obj.rewards_points or 0)

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    rewards_point = serializers.IntegerField(required=False) 

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'profile_image',  'password', 'rewards_point']

    def validate(self, data):
        if 'password' in data and len(data['password']) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres.")
        return data

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.save()
        return instance
    


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Players
        fields = ['id', 'name','lastname','photo_tokens']  # Agrega otros campos necesarios


class TokenSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ['id', 'year', 'created_at', 'is_burned', 'player']


    
class UserMeSerializer(serializers.ModelSerializer):
    total_points = serializers.SerializerMethodField()
    rewards_points = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    tokens = TokenSerializer(many=True, read_only=True, source='token_set')  # Cambia 'token_set' si has definido un related_name diferente

    class Meta:
        model = User
        fields = ['id','full_name', 'email', 'phone', 'profile_image', 'type_user','total_points', 'rewards_points','is_superuser', 'tokens']

    def get_total_points(self, obj):
        # Retorna la suma de total_points y rewards_points
        return (obj.total_points or 0) + (obj.rewards_points or 0)