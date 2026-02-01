from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import subprocess
import time

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, 'descargas_temp')

# Asegurar que la carpeta existe al arrancar
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/info', methods=['POST'])
def get_info():
    try:
        url = request.json.get('url')
        # 'noplaylist' evita errores si pegas un link de una lista
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
    duracion = fin - inicio

    timestamp = int(time.time())
    # Descargamos con un nombre único para evitar conflictos
    archivo_descarga = os.path.join(DOWNLOAD_FOLDER, f"temp_{timestamp}.%(ext)s")
    archivo_final = os.path.join(DOWNLOAD_FOLDER, f"final_{timestamp}.mp3")

    try:
        # FASE 1: Descarga del audio original
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': archivo_descarga,
            'quiet': True,
            'noplaylist': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            path_descargado = ydl.prepare_filename(info)
            titulo_real = info.get('title', 'audio_knz')

        # FASE 2: Recorte y conversión a MP3 con FFmpeg
        # Usamos 'ffmpeg' a secas porque en Ubuntu 24.04 ya está en el PATH global
        subprocess.run([
            'ffmpeg', '-y', 
            '-ss', str(inicio), 
            '-t', str(duracion), 
            '-i', path_descargado, 
            '-b:a', '192k', 
            archivo_final
        ], check=True)

        # FASE 3: Limpieza automática tras enviar
        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(path_descargado): os.remove(path_descargado)
                if os.path.exists(archivo_final): os.remove(archivo_final)
            except Exception as e:
                print(f"Error limpiando: {e}")
            return response

        nombre_bonito = "".join([x for x in titulo_real if x.isalnum() or x in " -_."]).strip() + ".mp3"

        return send_file(
            archivo_final,
            as_attachment=True,
            download_name=nombre_bonito,
            mimetype='audio/mpeg'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Importante: host 0.0.0.0 para que sea accesible desde internet
    app.run(host='0.0.0.0', port=80)