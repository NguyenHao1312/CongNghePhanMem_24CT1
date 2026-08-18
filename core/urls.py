from django.contrib import admin
from django.urls import path
from django.views.debug import default_urlconf # Lôi trang tên lửa mặc định ra

def home(request):
    response = default_urlconf(request)
    
    html_goc = response.content.decode('utf-8')
    
    html_da_sua = html_goc.replace(
        "The install worked successfully! Congratulations!", 
        "Chào mừng bạn đến với 24CT1, học phần CNPM-DAU"
    )
    
    html_da_sua = html_da_sua.replace(
        "Welcome to Django",
        "Bài tập CNPM"
    )
    
    response.content = html_da_sua.encode('utf-8')
    return response

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home), 
]