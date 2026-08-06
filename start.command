#!/bin/bash
# Двойной щелчок по этому файлу запускает Migue на localhost.
# Закрыть окно Терминала = остановить сервер.
cd "$(dirname "$0")" || exit 1

PORT=8000
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done

# адрес Мака в домашней сети — по нему можно открыть с телефона
IP=""
for IFACE in en0 en1 en2; do
  IP=$(ipconfig getifaddr $IFACE 2>/dev/null) && [ -n "$IP" ] && break
done

echo ""
echo "  ┌───────────────────────────────────────────────"
echo "  │  Migue запущен"
echo "  │"
echo "  │  на этом компьютере:  http://localhost:$PORT"
if [ -n "$IP" ]; then
  echo "  │  с телефона (тот же Wi-Fi):  http://$IP:$PORT"
else
  echo "  │  адрес для телефона не определился — нет Wi-Fi?"
fi
echo "  │"
echo "  │  Остановить — закрыть это окно или Ctrl+C"
echo "  └───────────────────────────────────────────────"
echo ""

sleep 1 && open "http://localhost:$PORT" &
python3 -m http.server $PORT --bind 0.0.0.0
