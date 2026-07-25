#!/bin/bash
# Двойной щелчок по этому файлу запускает Migue на localhost.
# Закрыть окно Терминала = остановить сервер.
cd "$(dirname "$0")" || exit 1
PORT=8000
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done
echo ""
echo "  Migue запущен:  http://localhost:$PORT"
echo "  Чтобы остановить — закрой это окно или нажми Ctrl+C"
echo ""
sleep 1 && open "http://localhost:$PORT" &
python3 -m http.server $PORT
