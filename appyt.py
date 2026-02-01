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

# Asegurar que la carpeta de descargas existe
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# --- RUTAS DE NAVEGACIÓN ---
# Flask servirá los archivos directamente cuando Nginx se los pida

@app.route('/')
@app.route('/inicio')
def index():
    return app.send_static_file('index.html')

@app.route('/youknztube')
def route_yt():
    return app.send_static_file('youknztube.html')

@app.route('/rustknz')
def route_rust():
    return app.send_static_file('rustknz.html')

@app.route('/utilidad')
def route_util():
    return app.send_static_file('utilidadcounter.html')

# --- API DE DESCARGA ---

@app.route('/api/info', methods=['POST'])
def get_info():
    try:
        url = request.json.get('url')
        if not url:
            return jsonify({'error': 'No URL provided'}), 400
            
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
    archivo_descarga = os.path.join(DOWNLOAD_FOLDER, f"temp_{timestamp}.%(ext)s")
    archivo_final = os.path.join(DOWNLOAD_FOLDER, f"final_{timestamp}.mp3")

    try:
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

        # Recorte y conversión con FFmpeg
        subprocess.run([
            'ffmpeg', '-y', 
            '-ss', str(inicio), 
            '-t', str(duracion), 
            '-i', path_descargado, 
            '-b:a', '192k', 
            archivo_final
        ], check=True)

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(path_descargado): os.remove(path_descargado)
                # El archivo_final se borra después de enviarlo si fuera necesario, 
                # pero Flask send_file lo necesita abierto para el streaming.
                # Lo ideal es una tarea programada, pero para poco tráfico está bien.
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
        print(f"Error en descarga: {e}")
        return jsonify({'error': str(e)}), 500

# --- CAPTURADOR GENÉRICO (Para JS, CSS, Fotos y .html directos) ---
@app.route('/<path:path>')
def static_proxy(path):
    try:
        return app.send_static_file(path)
    except:
        return jsonify({'error': 'Archivo no encontrado'}), 404

if __name__ == '__main__':
    # Localhost en puerto 5000 para que Nginx lo vea
    app.run(host='127.0.0.1', port=5000, debug=True)