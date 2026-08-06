// ===================================================================
//  СПИСОК ПРЕДМЕТОВ
//
//  Чтобы добавить новый предмет:
//   1. положи фото с микроскопа в  photos/micro/имя.jpg
//   2. положи обычное фото       в  photos/big/имя.jpg
//      (имена файлов должны совпадать, латиницей, без пробелов)
//   3. допиши один блок в список ниже — название на всех языках
// ===================================================================

const ITEMS = [
  { id: "palm", t: {
      ru: "Ладонь", en: "Palm", fr: "Paume", de: "Handfläche",
      tr: "Avuç içi", es: "Palma de la mano", it: "Palmo della mano" } },

  { id: "blanket", t: {
      ru: "Пододеяльник", en: "Duvet cover", fr: "Housse de couette", de: "Bettbezug",
      tr: "Nevresim", es: "Funda nórdica", it: "Copripiumino" } },

  { id: "book", t: {
      ru: "Страница книги", en: "Book page", fr: "Page de livre", de: "Buchseite",
      tr: "Kitap sayfası", es: "Página de libro", it: "Pagina di libro" } },

  { id: "turtle-egg", t: {
      ru: "Яйцо черепахи", en: "Turtle egg", fr: "Œuf de tortue", de: "Schildkrötenei",
      tr: "Kaplumbağa yumurtası", es: "Huevo de tortuga", it: "Uovo di tartaruga" } },

  { id: "bougainvillea", t: {
      ru: "Бугенвиллея", en: "Bougainvillea", fr: "Bougainvillier", de: "Bougainvillea",
      tr: "Begonvil", es: "Buganvilla", it: "Bouganville" } },

  { id: "hair", t: {
      ru: "Волос", en: "Hair", fr: "Cheveu", de: "Haar",
      tr: "Saç teli", es: "Cabello", it: "Capello" } },

  { id: "wax", t: {
      ru: "Воск", en: "Wax", fr: "Cire", de: "Wachs",
      tr: "Balmumu", es: "Cera", it: "Cera" } },

  { id: "cicada-wing", t: {
      ru: "Крыло цикады", en: "Cicada wing", fr: "Aile de cigale", de: "Zikadenflügel",
      tr: "Ağustos böceği kanadı", es: "Ala de cigarra", it: "Ala di cicala" } },

  { id: "turtle-shell", t: {
      ru: "Панцирь черепахи", en: "Turtle shell", fr: "Carapace de tortue", de: "Schildkrötenpanzer",
      tr: "Kaplumbağa kabuğu", es: "Caparazón de tortuga", it: "Guscio di tartaruga" } },

  { id: "feather", t: {
      ru: "Перо", en: "Feather", fr: "Plume", de: "Feder",
      tr: "Tüy", es: "Pluma", it: "Piuma" } },

  { id: "cleopatra-sand", t: {
      ru: "Песок Клеопатры", en: "Cleopatra's sand", fr: "Sable de Cléopâtre", de: "Kleopatras Sand",
      tr: "Kleopatra kumu", es: "Arena de Cleopatra", it: "Sabbia di Cleopatra" } },
];

// сколько вариантов ответа показывать в одном вопросе
const CHOICES = 3;

// сколько вопросов в одной игре (0 — все предметы подряд)
const ROUND = 0;

// как сортировать таблицу рекордов:
//   "time"  — только по времени, кто быстрее
//   "score" — сначала по очкам, при равных очках по времени
const SORT = "time";
