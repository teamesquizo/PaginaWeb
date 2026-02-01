from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import subprocess
import time

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# En Ubuntu 24.04, suele estar en /usr/bin/ffmpeg. 'ffmpeg' a secas suele bastar si está en el PATH.
FFMPEG_PATH = "ffmpeg" 
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, 'descargas_temp')

# Asegurar permisos de escritura
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER, mode=0o777, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/info', methods=['POST'])
def get_info():
    try:
        url = request.json.get('url')
        ydl_opts = {'quiet': True, 'noplaylist': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return jsonify({
                'titulo': info.get('title'),
                'duracion': info.get('duration'),
                'thumbnail': info.get('thumbnail')
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/descargar', methods=['GET'])
def descargar():
    url = request.args.get('url')
    inicio = float(request.args.get('inicio', 0))
    fin = float(request.args.get('fin', 0))
    
    timestamp = int(time.time())
    # Usamos .m4a como intermedio porque yt-dlp lo baja más rápido, luego FFmpeg lo corta y pasa a mp3
    archivo_raw = os.path.join(DOWNLOAD_FOLDER, f"raw_{timestamp}.m4a")
    archivo_recortado = os.path.join(DOWNLOAD_FOLDER, f"output_{timestamp}.mp3")

    try:
        # 1. Descargar audio base
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': archivo_raw,
            'quiet': True,
            'noplaylist': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            titulo_real = info.get('title', 'audio_knz')

        # 2. Recorte y conversión profesional con FFmpeg
        duracion = fin - inicio
        # Comando optimizado: busca rápido con -ss antes de -i
        comando = [
            FFMPEG_PATH, '-y',
            '-ss', str(inicio),
            '-t', str(duracion),
            '-i', archivo_raw,
            '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k',
            archivo_recortado
        ]
        subprocess.run(comando, check=True)

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(archivo_raw): os.remove(archivo_raw)
                if os.path.exists(archivo_recortado): os.remove(archivo_recortado)
            except Exception as e:
                print(f"Error borrando: {e}")
            return response

        nombre_archivo = "".join([x for x in titulo_real if x.isalnum() or x in " -_."]).strip() + ".mp3"

        return send_file(
            archivo_recortado,
            as_attachment=True,
            download_name=nombre_archivo,
            mimetype='audio/mpeg'
        )

    except Exception as e:
        if os.path.exists(archivo_raw): os.remove(archivo_raw)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Importante: para VPS necesitas host 0.0.0.0
    app.run(host='0.0.0.0', port=5000, debug=False)