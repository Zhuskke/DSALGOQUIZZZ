from django.urls import path
from .views import *

urlpatterns = [
    path('', get_user, name='profile'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('register/', registerUser, name='register'),
    path('verify-otp/', verifyOTP, name='verify_otp'),  
    path('resend-otp/', resendOTP, name='resend_otp'), 
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('verify-otp_pass/', verify_otp_pass, name='verify_otp_pass'),
]