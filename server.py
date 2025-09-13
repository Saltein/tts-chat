from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torch
import uuid
import os
import logging
import soundfile as sf
import requests
import threading
import time
import glob

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

# -----------------------------
# Настройка и загрузка Silero TTS
# -----------------------------
logging.info("Загрузка модели Silero TTS...")

device = torch.device("cpu")
TEMP_DIR = "tts_temp"
os.makedirs(TEMP_DIR, exist_ok=True)

# Скачиваем модель, если её нет
model_path = os.path.join(TEMP_DIR, "model.pt")
if not os.path.isfile(model_path):
    logging.info("Скачивание модели...")
    url = "https://models.silero.ai/models/tts/ru/v3_1_ru.pt"
    response = requests.get(url)
    with open(model_path, 'wb') as f:
        f.write(response.content)
    logging.info("Модель скачана")

# Загружаем модель официальным способом
model = None
try:
    logging.info("Загрузка модели официальным способом...")
    model = torch.package.PackageImporter(model_path).load_pickle("tts_models", "model")
    model.to(device)
    logging.info("Модель успешно загружена")
except Exception as e:
    logging.error(f"Ошибка загрузки модели: {e}")

# Параметры и доступные голоса
sample_rate = 48000
# Все доступные голоса в модели
speakers = [
    'aidar', 'baya', 'kseniya', 'xenia', 'eugene', 'random',
    'aidar_v2', 'baya_v2', 'kseniya_v2', 'xenia_v2', 'eugene_v2'
]
DEFAULT_SPEAKER = 'aidar'

# Очередь для удаления файлов
files_to_delete = []

def cleanup_old_files():
    """Удаляем старые временные файлы"""
    try:
        # Удаляем файлы старше 1 часа
        for file_path in glob.glob(os.path.join(TEMP_DIR, "*.wav")):
            if os.path.isfile(file_path) and (time.time() - os.path.getmtime(file_path)) > 3600:
                os.remove(file_path)
                logging.info(f"Удален старый файл: {file_path}")
    except Exception as e:
        logging.error(f"Ошибка при очистке файлов: {e}")

def delete_file_later(file_path):
    """Добавляем файл в очередь для удаления через 30 секунд"""
    files_to_delete.append((file_path, time.time() + 30))

def cleanup_worker():
    """Фоновая задача для удаления файлов"""
    while True:
        try:
            current_time = time.time()
            # Удаляем файлы, время которых пришло
            for file_path, delete_time in files_to_delete[:]:
                if current_time >= delete_time:
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            logging.info(f"Удален временный файл: {file_path}")
                        files_to_delete.remove((file_path, delete_time))
                    except Exception as e:
                        logging.error(f"Ошибка удаления файла {file_path}: {e}")
                        files_to_delete.remove((file_path, delete_time))
            
            # Удаляем старые файлы каждые 5 минут
            if current_time % 300 < 1:
                cleanup_old_files()
                
            time.sleep(1)
        except Exception as e:
            logging.error(f"Ошибка в cleanup_worker: {e}")
            time.sleep(5)

# Запускаем фоновую задачу для очистки
cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
cleanup_thread.start()

def text_to_speech(text, speaker=None):
    if speaker is None or speaker not in speakers:
        speaker = DEFAULT_SPEAKER

    if model is None:
        raise Exception("Модель не загружена")

    filename = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.wav")
    logging.info(f"Генерация речи: '{text[:30]}...' с голосом '{speaker}'")

    try:
        # Генерируем аудио с указанным голосом
        audio = model.apply_tts(
            text=text,
            speaker=speaker,
            sample_rate=sample_rate
        )
        
        # Сохраняем аудио
        sf.write(filename, audio, sample_rate)
        logging.info(f"Аудио сгенерировано: {filename}")
        return filename
        
    except Exception as e:
        logging.error(f"Ошибка генерации речи: {e}")
        # Удаляем файл, если он был создан с ошибкой
        if os.path.exists(filename):
            os.remove(filename)
        raise Exception(f"Не удалось сгенерировать речь: {e}")

# -----------------------------
# Эндпоинты
# -----------------------------
@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()
    if not data or "text" not in data:
        logging.warning("Некорректный запрос: 'text' отсутствует")
        return jsonify({"error": "Missing 'text' in request"}), 400

    text = data["text"]
    speaker = data.get("speaker", DEFAULT_SPEAKER)
    
    # Проверяем, что указанный голос существует
    if speaker not in speakers:
        logging.warning(f"Запрошенный голос '{speaker}' не найден. Используется голос по умолчанию: {DEFAULT_SPEAKER}")
        speaker = DEFAULT_SPEAKER
    
    try:
        filename = text_to_speech(text, speaker)
        
        # Отправляем файл с уникальным именем для предотвращения кэширования
        response = send_file(
            filename, 
            mimetype="audio/wav",
            as_attachment=True,
            download_name=f"speech_{speaker}_{uuid.uuid4().hex[:8]}.wav"
        )
        
        # Добавляем заголовки для предотвращения кэширования
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers["Content-Disposition"] = f"attachment; filename=speech_{speaker}_{uuid.uuid4().hex[:8]}.wav"
        
        # Добавляем файл в очередь для удаления
        delete_file_later(filename)
        
        return response
        
    except Exception as e:
        logging.error(f"Ошибка генерации речи: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    status = "ok" if model is not None else "error"
    return jsonify({
        "status": status,
        "message": "TTS server is running" if model is not None else "Model not loaded"
    })

@app.route("/speakers", methods=["GET"])
def get_speakers():
    return jsonify({"speakers": speakers})

@app.route("/cleanup", methods=["POST"])
def manual_cleanup():
    """Ручная очистка временных файлов"""
    try:
        cleanup_old_files()
        return jsonify({"message": "Cleanup completed"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Запуск сервера
# -----------------------------
if __name__ == "__main__":
    # Очищаем старые файлы при запуске
    cleanup_old_files()
    
    if model is None:
        logging.error("Не удалось загрузить модель TTS! Сервер не может работать.")
    else:
        logging.info("Запуск Flask-сервера на http://0.0.0.0:5001")
        app.run(host="0.0.0.0", port=5001)