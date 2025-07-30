# Create venv
```sh
python3 -m venv .venv
```

# Activate venv
```sh
source .venv/bin/activate
```

# Install django
```sh
pip install django
```

# Init project
```sh
django-admin startproject notes_project
```

# Init app
```sh
cd notes_project
python manage.py startapp notes
```