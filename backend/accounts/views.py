from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, MyTokenObtainPairSerializer, UserSerializerWithToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth.models import User
from django.core.mail import send_mail
import random
from .models import *
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, MyTokenObtainPairSerializer, UserSerializerWithToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth.models import User
from accounts.serializers import *
from django.conf import settings
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from accounts.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserPasswordResetSerializer,UserProfileSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from accounts.renderers import UserRenderer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

def generate_otp():
    return str(random.randint(100000, 999999))


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET', 'POST'])
def get_user(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'POST':
        # Handle POST request logic here if needed
        return Response({'message': 'POST request received'})


@api_view(['POST'])
def registerUser(request):
    data = request.data
    print("Received data:", data)
    try:
        user = User.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password')),
            is_active=False
        )
        
        otp = generate_otp()
        profile = Profile.objects.create(user=user, otp=otp) 
        send_mail(
            'OTP Verification',
            f'Your OTP is: {otp}',
            'your_email@example.com',
            [data.get('email')],
            fail_silently=False,
        )

        serializer = UserSerializerWithToken(user, many=False)
        response_data = serializer.data
        response_data['userId'] = user.id  # Include userId in the response
        return Response(response_data)
    except Exception as e:
        print("Exception:", e)
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verifyOTP(request):
    data = request.data
    user_id = data.get('user_id')
    otp_entered = data.get('otp')
    
    try:    
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        if profile.otp == otp_entered:
            user.is_active = True
            user.save()
            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def resendOTP(request):
    data = request.data
    user_id = data.get('user_id')
    
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        
        otp = generate_otp()
        profile.otp = otp
        profile.save()
        
        send_mail(
            'OTP Verification',
            f'Your OTP is: {otp}',
            'your_email@example.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'detail': 'OTP resent successfully'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer= UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



class UserChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access
    authentication_classes = [JWTAuthentication]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]
    def post(self,request, uid, token , format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context = {'uid':uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':"Password Reset Succesfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    