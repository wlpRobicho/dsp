# Dockerfile

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x wait-for-it.sh

CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]


# FROM python:3.11-slim

# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# WORKDIR /app

# # Install dos2unix
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends dos2unix && \
#     rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# # Convert line endings for ALL files and make scripts executable
# RUN find . -type f -exec dos2unix {} ; && \
#     chmod +x wait-for-it.sh

# CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]