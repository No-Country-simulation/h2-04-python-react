from rest_framework import serializers
from core.models import User

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
    class Meta:
        model = User
        fields = ['id','full_name', 'email', 'phone', 'profile_image']


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'profile_image', 'password']

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