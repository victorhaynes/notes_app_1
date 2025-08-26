from django_seed import Seed
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from notes.models import Note
import random

# (.venv $) python manage.py shell < seed.py


num_users = 3
for i in range(num_users):
    username = f"user{i+1}"
    email = f"user{i+1}@example.com"
    password = make_password("password123")
    
    if not User.objects.filter(username=username).exists():
        User.objects.create(username=username, email=email, password=password)

print(f"Seeded {num_users} users: user1..user{num_users}")

seeder = Seed.seeder()
seeder.add_entity(Note, 50, {
    "owner": lambda x: User.objects.order_by("?").first(), # random user
    "title": lambda x: seeder.faker.sentence(),
    "content": lambda x: seeder.faker.paragraph(nb_sentences=5),
    "created_at": lambda x: timezone.now(), # auto generated stamps don't work with modern django (old package)
    "updated_at": lambda x: timezone.now(),
})

pks_of_results = seeder.execute()  # returns dict: {Note: [PKs]}
note_ids = pks_of_results.get(Note, [])  # get list of note IDs
print(f"Seeded {len(note_ids)} notes: {note_ids}")