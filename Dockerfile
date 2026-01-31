FROM python:3.9-slim

# Instala FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

# Copia los archivos del repo al contenedor
COPY . .

# Instala las librerías de Python
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto que usa Render
EXPOSE 10000

# Comando para arrancar la app
CMD ["python", "appyt.py"]