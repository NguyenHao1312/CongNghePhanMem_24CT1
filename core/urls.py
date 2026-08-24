from django.contrib import admin
from django.urls import path
from django.views.generic.base import RedirectView
from student_management import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'), 
    path('review/', views.review, name='review'),
    
    # Redirects for common .html mistakes
    path('review.html', RedirectView.as_view(url='/review/', permanent=True)),
    path('index.html', RedirectView.as_view(url='/', permanent=True)),
]