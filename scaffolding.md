# 1) Basic setup for django project (session based auth)
### Create venv
```sh
python3 -m venv .venv
```

### Activate venv
```sh
source .venv/bin/activate
```

### Create basic gitignore file
```txt
.gitignore
```

### Install django, psycopg2 (psql support), DRF, DRF CORS headers, and decouple (secrets management)
```sh
pip install django
pip install psycopg2-binary
pip install djangorestframework
pip install django-cors-headers
pip install python-decouple
```

### Init project
```sh
django-admin startproject notes_project
```

### Init app
```sh
cd notes_project
python manage.py startapp notes
```

### Edit settings.py
```py
INSTALLED_APPS = [
    'rest_framework', # added, Django REST Framework
    'corsheaders', # added, CORS support
    'notes', # added, notes app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # added, CORS middleware
    'django.contrib.sessions.middleware.SessionMiddleware', # added, session middleware for DRF
    'django.contrib.auth.middleware.AuthenticationMiddleware', # added, authentication middleware for DRF]
]

REST_FRAMEWORK = { # added, DRF session based authentication
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

CORS_ALLOW_CREDENTIALS = True # added, CORS support
CORS_ALLOWED_ORIGINS = ['http://localhost:3000'] # added, CORS support

DATABASES = { # added, psql setup
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'n1',
        'USER': 'victorhaynes',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Or using python-deoucple
#
# from decouple import config
# DATABASES = { # added, psql setup
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': config('DB_NAME'),
#         'USER': config('DB_USER'),
#         'PASSWORD': config('DB_PASSWORD'),
#         'HOST': config('DB_HOST'),
#         'PORT': config('DB_PORT'),
#     }
# }
```

### Migrate
```sh
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser if desired
```sh
python manage.py createsuperuser
```

## 2) App-specific steps
- models
- serializers
- views
- urls
