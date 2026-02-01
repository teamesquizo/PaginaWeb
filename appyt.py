# officialknz pagina/appyt.py

from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import subprocess
import time

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_EXE = "/usr/bin/ffmpeg"  # ffmpeg del sistema Linux
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, 'descargas_temp')

if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# Ruta principal
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Servir archivos estáticos
@app.route('/<path:path>')
def static_files(path):
    return app.send_static_file(path)

# API: Obtener info del video
@app.route('/api/info', methods=['POST'])
def get_info():
    try:
        url = request.json.get('url')
        ydl_opts = {'quiet': True, 'ffmpeg_location': FFMPEG_EXE}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return jsonify({
                'titulo': info.get('title'),
                'duracion': info.get('duration'),
                'thumbnail': info.get('thumbnail')
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# API: Descargar y recortar
@app.route('/api/descargar', methods=['GET'])
def descargar():
    url = request.args.get('url')
    inicio = float(request.args.get('inicio', 0))
    fin = float(request.args.get('fin', 0))

    timestamp = int(time.time())
    archivo_yt_mp3 = os.path.join(DOWNLOAD_FOLDER, f"input_{timestamp}.mp3")
    archivo_recortado = os.path.join(DOWNLOAD_FOLDER, f"output_{timestamp}.mp3")

    try:
        # Descargar audio directamente a MP3
        ydl_opts = {
            'format': 'bestaudio/best',
            'ffmpeg_location': FFMPEG_EXE,
            'outtmpl': archivo_yt_mp3,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            titulo_real = info.get('title', 'audio_knz')

        # Recorte del MP3 descargado
        duracion = fin - inicio
        subprocess.run([
            FFMPEG_EXE, '-y', '-ss', str(inicio), '-t', str(duracion),
            '-i', archivo_yt_mp3,
            '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k',
            archivo_recortado
        ], check=True)

        # Limpiar archivo original
        if os.path.exists(archivo_yt_mp3):
            os.remove(archivo_yt_mp3)

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(archivo_recortado):
                    os.remove(archivo_recortado)
            except:
                pass
            return response

        nombre_archivo = "".join([x for x in titulo_real if x.isalnum() or x in " -_."]).strip() + ".mp3"

        return send_file(
            archivo_recortado,
            as_attachment=True,
            download_name=nombre_archivo,
            mimetype='audio/mpeg'
        )

    except Exception as e:
        if os.path.exists(archivo_yt_mp3): os.remove(archivo_yt_mp3)
        if os.path.exists(archivo_recortado): os.remove(archivo_recortado)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
