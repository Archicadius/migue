// ===================================================================
//  ХРАНИЛИЩЕ РЕКОРДОВ
//
//  Пока SUPABASE_URL пустой — рекорды лежат в памяти браузера
//  (у каждого своя таблица). Как только впишем адрес и ключ Supabase,
//  таблица автоматически станет общей для всех игроков.
// ===================================================================

const SUPABASE_URL = "";   // например "https://xxxx.supabase.co"
const SUPABASE_KEY = "";   // публичный anon key
const TABLE        = "scores";
const LIMIT        = 50;   // сколько строк показывать

const Records = (function () {
  "use strict";

  const shared = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
  const LS_KEY = "migue.scores";

  // --- локальное хранилище -----------------------------------------
  function localAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch (e) { return []; }
  }
  function localAdd(row) {
    const all = localAll();
    all.push(row);
    try { localStorage.setItem(LS_KEY, JSON.stringify(all.slice(-500))); } catch (e) {}
    return row;
  }

  // --- Supabase (REST) ---------------------------------------------
  function api(path, opts) {
    return fetch(SUPABASE_URL + "/rest/v1/" + path, Object.assign({
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
    }, opts)).then(r => {
      if (!r.ok) throw new Error("supabase " + r.status);
      return r.json();
    });
  }

  // --- сортировка ---------------------------------------------------
  function sortRows(rows, mode) {
    return rows.slice().sort((a, b) =>
      mode === "score"
        ? (b.score - a.score) || (a.seconds - b.seconds)
        : (a.seconds - b.seconds) || (b.score - a.score));
  }

  return {
    isShared: shared,

    // {name, score, total, seconds} → Promise<row>
    add: function (row) {
      const clean = {
        name: String(row.name || "").slice(0, 20).trim() || "?",
        score: row.score | 0,
        total: row.total | 0,
        seconds: row.seconds | 0,
        lang: row.lang || "ru",
        created_at: new Date().toISOString(),
      };
      clean.key = clean.created_at + "|" + clean.name;
      if (!shared()) return Promise.resolve(localAdd(clean));
      const forServer = Object.assign({}, clean);
      delete forServer.key;
      return api(TABLE, { method: "POST", body: JSON.stringify(forServer) })
        .then(res => Object.assign(clean, res && res[0]))
        .catch(() => localAdd(clean));   // нет сети — сохраним хотя бы у себя
    },

    // Promise<[row]> — уже отсортировано
    top: function (mode) {
      if (!shared()) return Promise.resolve(sortRows(localAll(), mode).slice(0, LIMIT));
      const order = mode === "score"
        ? "score.desc,seconds.asc"
        : "seconds.asc,score.desc";
      return api(TABLE + "?select=*&order=" + order + "&limit=" + LIMIT)
        .catch(() => sortRows(localAll(), mode).slice(0, LIMIT));
    },
  };
})();
