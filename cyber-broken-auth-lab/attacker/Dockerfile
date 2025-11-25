FROM python:3.10-slim

WORKDIR /app

COPY brute.py config.env ./

RUN pip install --no-cache-dir requests python-dotenv

CMD ["python", "brute.py"]
