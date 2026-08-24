from django.contrib import admin
from django.urls import path
from student_management import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'), 
    path('review/', views.review, name='review'),
]