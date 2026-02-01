from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import subprocess
import time

# --- Configuración Flask ---
app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# --- Rutas y variables ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_EXE = 'ffmpeg'  # Usa el ffmpeg instalado en el sistema
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, 'descargas_temp')

if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# --- Rutas del frontend ---
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
    return app.send_static_file(path)

# --- API para info del vídeo ---
@app.route('/api/info', methods=['POST'])
def get_info():
    try:
        url = request.json.get('url')
        ydl_opts = {'quiet': True, 'ffmpeg_location': None}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return jsonify({
                'titulo': info.get('title'),
                'duracion': info.get('duration'),
                'thumbnail': info.get('thumbnail')
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- API para descargar y recortar ---
@app.route('/api/descargar', methods=['GET'])
def descargar():
    url = request.args.get('url')
    inicio = float(request.args.get('inicio', 0))
    fin = float(request.args.get('fin', 0))

    timestamp = int(time.time())
    archivo_completo = os.path.join(DOWNLOAD_FOLDER, f"input_{timestamp}.mp3")
    archivo_recortado = os.path.join(DOWNLOAD_FOLDER, f"output_{timestamp}.mp3")

    try:
        # 1. Descarga
        ydl_opts = {
            'format': 'bestaudio/best',
            'ffmpeg_location': None,
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, f"input_{timestamp}.%(ext)s"),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            titulo_real = info.get('title', 'audio_knz')

        # 2. Recorte
        duracion = fin - inicio
        subprocess.run([
            FFMPEG_EXE, '-y', '-ss', str(inicio), '-t', str(duracion),
            '-i', archivo_completo, '-acodec', 'copy', archivo_recortado
        ], check=True)

        # 3. Limpieza del archivo original
        if os.path.exists(archivo_completo):
            os.remove(archivo_completo)

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(archivo_recortado):
                    os.remove(archivo_recortado)
            except:
                pass
            return response

        nombre_archivo = "".join([x for x in titulo_real if x.isalnum() or x in " -_."]).strip() + ".mp3"

        # 4. Enviar archivo
        return send_file(
            archivo_recortado,
            as_attachment=True,
            download_name=nombre_archivo,
            mimetype='audio/mpeg'
        )

    except Exception as e:
        # Limpieza en caso de error
        if os.path.exists(archivo_completo): os.remove(archivo_completo)
        if os.path.exists(archivo_recortado): os.remove(archivo_recortado)
        return jsonify({'error': str(e)}), 500

# --- Arranque del servidor ---
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=PORT)
