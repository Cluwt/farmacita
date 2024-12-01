from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4xek4gkhd%v5mq5ejlnqxheq@sb8q^u4ddb5-slz@lka7xy+=a'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'  # Usando o backend SMTP
EMAIL_HOST = 'smtp.gmail.com'  # Servidor SMTP do Gmail
EMAIL_PORT = 587  # Porta para envio de e-mails com TLS
EMAIL_USE_TLS = True  # Usar TLS para segurança
EMAIL_HOST_USER = 'csar.cluwt@gmail.com'  # Seu e-mail Gmail
EMAIL_HOST_PASSWORD = 'iinx trlu uhcn ifjj'  # A senha de aplicativo gerada
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER  # E-mail de envio





# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Add these apps
    'rest_framework',      # For DRF support
    'core',                # Your app name
    'corsheaders',         # For CORS support
]

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Frontend URL (React)
]

CORS_ALLOW_CREDENTIALS = True  # Allow credentials (cookies)

CORS_ALLOW_METHODS = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',  # This is essential for session management
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF middleware
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Ensure authentication middleware is included
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',  # Isso é essencial para o gerenciamento de sessão
    'corsheaders.middleware.CorsMiddleware',  # Certifique-se de que o middleware CORS vem antes de CommonMiddleware
]

ROOT_URLCONF = 'farmacinha_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'farmacinha_backend.wsgi.application'

# Database settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Language and time zone
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication settings
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # Default authentication backend
)

# Session settings
SESSION_COOKIE_SAMESITE = 'Lax'  # 'Lax' or 'Strict' depending on your needs
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'  # 'Lax' or 'Strict' depending on your needs
CSRF_COOKIE_SECURE = False  # Set to True for production if you're using https

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # JWT Authentication
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Require authenticated access
    ]
}

# JWT Settings for Simple JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  # Token expiration time
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',  # JWT algorithm
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# To enable debugging, logging information on each request
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

