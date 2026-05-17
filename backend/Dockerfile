FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
ENV PYTHONPATH=/app/backend
ENV PORT=10000
ENV PYTHONUNBUFFERED=1
EXPOSE 10000
CMD ["python","main.py"]