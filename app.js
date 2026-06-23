(function () {
	"use strict";

	const AVATAR_COLORS = ["#6c8cff", "#00d4a8", "#ff6b9d", "#ffb84d", "#9b6cff", "#ff7849", "#3ecf8e"];
	const $ = (sel, root = document) => root.querySelector(sel);
	const app = $("#app");

	const RANKS = {
		"Руководство Проекта":        { color: "#ff0033", icon: "👑", priority: 170 },
		"Руководитель Проекта":       { color: "#e11d48", icon: "🔥", priority: 160 },
		"Спец.Администратор":         { color: "#b91c1c", icon: "⭐", priority: 150 },
		"ГА":                         { color: "#dc2626", icon: "💎", priority: 140 },
		"ЗГА":                        { color: "#2563eb", icon: "🔷", priority: 130 },
		"Куратор Администрации":      { color: "#f97316", icon: "🔶", priority: 120 },
		"ГК Фракции":                 { color: "#f59e0b", icon: "🏆", priority: 110 },
		"ЗГК Фракции":                { color: "#7c3aed", icon: "🎖️", priority: 100 },
		"Куратор":                    { color: "#8b5cf6", icon: "👁️", priority: 90 },
		"Старший Администратор":      { color: "#a78bfa", icon: "🔸", priority: 80 },
		"YouTube Администратор":      { color: "#ef4444", icon: "📹", priority: 75 },
		"Администратор":              { color: "#3b82f6", icon: "🛡️", priority: 70 },
		"Младший Администратор":      { color: "#60a5fa", icon: "📋", priority: 60 },
		"Гл.Модератор":               { color: "#0891b2", icon: "📐", priority: 50 },
		"Старший Модератор":          { color: "#06b6d4", icon: "🛠️", priority: 40 },
		"Модератор":                  { color: "#00d4a8", icon: "🔧", priority: 30 },
		"Хелпер":                     { color: "#4ade80", icon: "🤝", priority: 20 },
		"Игрок":                      { color: "#9aa0b4", icon: "🎮", priority: 0 },
	};
	const RANK_KEYS = Object.keys(RANKS);
	const ADMIN_RANKS = ["Руководство Проекта","Руководитель Проекта","Спец.Администратор","ГА","ЗГА","Куратор Администрации","ГК Фракции","ЗГК Фракции","Куратор","Старший Администратор","YouTube Администратор","Администратор","Младший Администратор"];
	const GOSHA_NAMES = ["Гоша", "гоша", "ГОША", "Geosha", "geosha", "Г0ша"];

	function isGosha(name) {
		return name && GOSHA_NAMES.includes(name);
	}
	function rankInfo(role) {
		return RANKS[role] || RANKS["Игрок"];
	}
	function rankBadge(role) {
		const r = rankInfo(role);
		return '<span class="rank-badge" style="--rc:' + r.color + '">' + r.icon + " " + escapeHtml(role) + "</span>";
	}
	function rankColor(role) {
		return rankInfo(role).color;
	}
	function hasAdminAccess(user) {
		if (!user) return false;
		if (isGosha(user.name)) return true;
		return ADMIN_RANKS.includes(user.role);
	}

	function avatarColor(name) {
		let h = 0;
		for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
		return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
	}
	function initials(name) {
		return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
	}
	function escapeHtml(s) {
		return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
	}
	function timeAgo(ts) {
		const diff = Math.floor((Date.now() - ts) / 1000);
		if (diff < 60) return "только что";
		if (diff < 3600) return Math.floor(diff / 60) + " мин назад";
		if (diff < 86400) return Math.floor(diff / 3600) + " ч назад";
		if (diff < 604800) return Math.floor(diff / 86400) + " дн назад";
		return new Date(ts).toLocaleDateString("ru-RU");
	}
	function fmt(n) {
		return n.toLocaleString("ru-RU");
	}

	const DEFAULT_DATA = {
		users: [
			{ id: 1, name: "Гоша", role: "Руководство Проекта", color: "#ff0033", joined: Date.now() - 2592e6, posts: 42 },
			{ id: 2, name: "Алексей", role: "ГА", color: "#dc2626", joined: Date.now() - 216e7, posts: 28 },
			{ id: 3, name: "Максим", role: "Модератор", color: "#00d4a8", joined: Date.now() - 1728e6, posts: 15 },
			{ id: 4, name: "Дарья", role: "Хелпер", color: "#4ade80", joined: Date.now() - 1296e6, posts: 31 },
		],
		categories: [
			{
				id: "rules", title: "Правила проекта",
				forums: [
					{ id: "general-rules", icon: "📜", name: "Общие правила", desc: "Основные правила сервера и форума", threads: 8, posts: 8 },
					{ id: "org-rules", icon: "🏛️", name: "Правила организаций", desc: "Госструктуры, крайм, семьи", threads: 12, posts: 12 },
				],
			},
		{
			id: "gov-structures", title: "Государственные структуры",
			forums: [
				{ id: "pravitelstvo", icon: "🏛️", name: "Правительство", desc: "Официальный портал органов власти. Законодательная и исполнительная власть, министерства, аппарат Председателя Правительства. Назначения на госдолжности, подача законопроектов и госпрограмм.", threads: 1820, posts: 9430,
					subforums: [
						{ id: "prav-min", icon: "📋", name: "Министерства", desc: "Все министерства и ведомства", threads: 320, posts: 1200 },
						{ id: "prav-app", icon: "✍️", name: "Назначения на должности", desc: "Заявления и назначения", threads: 150, posts: 800 },
					],
				},
				{ id: "fsb", icon: "🛡️", name: "ФСБ — Федеральная Служба Безопасности", desc: "Борьба с терроризмом, контрразведка, разведка, обеспечение государственной безопасности. Расследование тяжких преступлений против государства. Электронное заявление в Академию ФСБ, спецсвязь.", threads: 980, posts: 4120 },
				{ id: "gumvd", icon: "👮", name: "ГУ МВД — Главное Управление Внутренних Дел", desc: "Охрана правопорядка, борьба с уличной преступностью, патрулирование, оперативно-разыскная деятельность. УВД по округам, ГИБДД (ДПС), следственные отделы. Электронные заявления в полицию и ГИБДД.", threads: 3240, posts: 18600,
					subforums: [
						{ id: "mvd-patrol", icon: "🚔", name: "Патрульно-постовая служба", desc: "ППС, ДПС, патрулирование", threads: 890, posts: 4200 },
						{ id: "mvd-invest", icon: "🔍", name: "Уголовный розыск", desc: "Оперативно-разыскная работа", threads: 560, posts: 3100 },
						{ id: "mvd-gibdd", icon: "🚦", name: "ГИБДД (ДПС)", desc: "Дорожный надзор, регистрация ТС", threads: 410, posts: 1800 },
					],
				},
				{ id: "fsvng", icon: "🪖", name: "ФСВНГ — Росгвардия", desc: "Федеральная Служба Войск Национальной Гвардии. Охрана общественного порядка, обеспечение безопасности при ЧС, силовая поддержка спецопераций, охрана важных объектов. Электронное заявление в УФСВНГ, спецсвязь.", threads: 1340, posts: 6800 },
			],
		},
		{
			id: "server1", title: "Игровой сервер — Центральный",
				forums: [
				{ id: "crime", icon: "🔫", name: "Криминальные организации", desc: "Банды, семьи, нелегальный бизнес", threads: 3210, posts: 15640 },
					{ id: "rp", icon: "🎭", name: "RolePlay ситуации и биографии", desc: "RP отыгровки и истории персонажей", threads: 8940, posts: 41200 },
					{ id: "complaints", icon: "⚖️", name: "Жалобы и заявления", desc: "Жалобы на игроков, лидеров, администрацию", threads: 12500, posts: 38900 },
				],
			},
			{
				id: "community", title: "Сообщество",
				forums: [
					{ id: "media", icon: "📸", name: "Медиа и скриншоты", desc: "Скрины, видео, стримы с сервера", threads: 1840, posts: 9230 },
					{ id: "guides", icon: "📖", name: "Гайды и туториалы", desc: "Помощь новичкам, разбор механик", threads: 540, posts: 3120 },
					{ id: "offtop", icon: "💬", name: "Оффтоп", desc: "Общение на любые темы", threads: 2100, posts: 14700 },
				],
			},
		],
		threads: [
			{ id: 1001, forumId: "general-rules", title: "📌 Обновлённые правила форума — читать всем", author: 1, created: Date.now() - 864e5, posts: [
				{ author: 1, created: Date.now() - 864e5, content: "Уважаемые игроки!\n\nПеред использованием форума обязательно ознакомьтесь с правилами:\n\n1. Уважительное общение\n2. Запрет рекламы\n3. Запрет мата и оскорблений\n4. Темы в соответствующих разделах\n\nНезнание правил не освобождает от ответственности." }
			], pinned: true, closed: false, views: 8420 },
			{ id: 1002, forumId: "complaints", title: "Жалоба на игрока [ID 1234] — DB у больницы", author: 3, created: Date.now() - 36e5, posts: [
				{ author: 3, created: Date.now() - 36e5, content: "Игрок на автомобиле сбил меня у входа в больницу без причины и уехал.\n\nНик: TestPlayer\nID: 1234\nВремя: около 15:30 МСК\n\nПрилагаю доказательства (видео)." },
				{ author: 2, created: Date.now() - 18e5, content: "Жалоба принята к рассмотрению. Ожидайте ответа администрации." },
			], pinned: false, closed: false, views: 124 },
			{ id: 1003, forumId: "guides", title: "Полный гайд: как начать играть новичку", author: 4, created: Date.now() - 72e5, posts: [
				{ author: 4, created: Date.now() - 72e5, content: "Решил собрать гайд для новичков, потому что сам долго разбирался.\n\n1. Создай персонажа\n2. Получи паспорт в мэрии\n3. Устройся на работу\n4. Купи первый транспорт\n\nПодробности внутри темы." }
			], pinned: false, closed: false, views: 892 },
			{ id: 1004, forumId: "media", title: "Красивые закаты на сервере 🌅", author: 4, created: Date.now() - 18e6, posts: [
				{ author: 4, created: Date.now() - 18e6, content: "Набрала подборку скриншотов закатов в разных районах города. Делитесь своими в комментариях!" }
			], pinned: false, closed: false, views: 312 },
			{ id: 1005, forumId: "offtop", title: "Во что играете кроме нашей RP?", author: 3, created: Date.now() - 2592e5, posts: [
				{ author: 3, created: Date.now() - 2592e5, content: "Интересно, какие ещё игры любят местные. Пишите свои любимые тайтлы." }
			], pinned: false, closed: false, views: 540 },
			{ id: 1006, forumId: "rp", title: "[Биография] Дмитрий Кравцов — бывший военный", author: 3, created: Date.now() - 432e5, posts: [
				{ author: 3, created: Date.now() - 432e5, content: "Имя: Дмитрий Кравцов\nВозраст: 32\nРод занятий: бывший контрактник ВС РФ\n\nИстория персонажа с детства до нынешнего времени. Подробное описание характера и мотивации." }
			], pinned: false, closed: false, views: 178 },
			{ id: 1007, forumId: "pravitelstvo", title: "📌 Структура Правительства — список министерств и назначений", author: 1, created: Date.now() - 12e7, posts: [
				{ author: 1, created: Date.now() - 12e7, content: "Официальная структура исполнительной власти:\n\n• Председатель Правительства\n• Министр социальной политики\n• Министр юстиции\n• Министр обороны\n• Министр внутренних дел\n\nНазначения производятся через аппарат Правительства. Заявления — в соответствующих разделах." }
			], pinned: true, closed: false, views: 2400 },
			{ id: 1008, forumId: "fsb", title: "Электронное заявление в Академию ФСБ", author: 2, created: Date.now() - 8e7, posts: [
				{ author: 2, created: Date.now() - 8e7, content: "Открыт приём заявлений в Академию ФСБ.\n\nТребования:\n• Возраст от 21 года\n• Чистая история (без судимостей)\n• Прохождение собеседования и проверки\n\nФорма заявления закреплена ниже." }
			], pinned: true, closed: false, views: 1850 },
			{ id: 1009, forumId: "gumvd", title: "Электронное заявление в УВД по ЦАО ГУ МВД", author: 2, created: Date.now() - 6e7, posts: [
				{ author: 2, created: Date.now() - 6e7, content: "Открыт набор в ряды полиции.\n\nСтруктура УВД:\n• Патрульно-постовая служба\n• Уголовный розыск\n• Дежурная часть\n• Отдел по борьбе с наркотиками\n\nПодавайте заявления по установленной форме." }
			], pinned: true, closed: false, views: 3200 },
			{ id: 1010, forumId: "fsvng", title: "Электронное заявление в УФСВНГ (Росгвардия)", author: 1, created: Date.now() - 5e7, posts: [
				{ author: 1, created: Date.now() - 5e7, content: "Войска национальной гвардии набирают личный состав.\n\nЗадачи Росгвардии:\n• Охрана общественного порядка\n• Обеспечение безопасности при ЧС\n• Силовая поддержка спецопераций\n• Охрана важных государственных объектов\n\nЗаявления принимаются круглосуточно." }
			], pinned: true, closed: false, views: 1100 },
		],
	};

	const STORE_KEY = "rpmforum_v5";
	const ADMIN_PASSWORD = "RPM-ADMIN-2024";
	const ADMIN_SESSION_KEY = "rpmforum_admin";
	const SESSION_KEY = "rpmforum_session";
	const GATE_KEY = "rpmforum_gate_ok";

	function loadData() {
		try {
			const raw = localStorage.getItem(STORE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && parsed.users && parsed.threads && parsed.categories) return parsed;
				console.warn("[Forum] Данные повреждены, сброс к defaults");
			}
		} catch (e) {
			console.error("[Forum] Ошибка чтения данных:", e);
		}
		const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
		localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
		return fresh;
	}
	function saveData(d) {
		try {
			localStorage.setItem(STORE_KEY, JSON.stringify(d));
			return true;
		} catch (e) {
			console.error("[Forum] Ошибка сохранения:", e);
			alert("⚠️ Не удалось сохранить данные! Возможно, переполнен localStorage. Ошибка: " + e.message);
			return false;
		}
	}
	function getSession() {
		try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
	}
	function setSession(user) {
		if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
		else localStorage.removeItem(SESSION_KEY);
	}

	let data = loadData();
	let session = getSession();

	function ensureGoshaAdmin() {
		let changed = false;
		let gosha = data.users.find((u) => isGosha(u.name));
		if (!gosha) {
			gosha = { id: Date.now(), name: "Гоша", role: "Руководство Проекта", color: "#ff0033", joined: Date.now(), posts: 0 };
			data.users.push(gosha);
			changed = true;
		}
		if (gosha.role !== "Руководство Проекта") {
			gosha.role = "Руководство Проекта";
			changed = true;
		}
		if (session && isGosha(session.name) && session.role !== "Руководство Проекта") {
			session.role = "Руководство Проекта";
			setSession(session);
		}
		if (changed) saveData(data);
	}
	ensureGoshaAdmin();

	function getUser(id) { return data.users.find((u) => u.id === id); }

	function getForum(id) {
		for (const c of data.categories) {
			for (const f of c.forums) {
				if (f.id === id) return f;
				if (f.subforums) {
					const sub = f.subforums.find((s) => s.id === id);
					if (sub) return sub;
				}
			}
		}
		return undefined;
	}

	function getParentForum(subId) {
		for (const c of data.categories) {
			for (const f of c.forums) {
				if (f.subforums && f.subforums.find((s) => s.id === subId)) return f;
			}
		}
		return undefined;
	}

	function getThread(id) { return data.threads.find((t) => t.id === Number(id)); }
	function forumThreads(fid) { return data.threads.filter((t) => t.forumId === fid); }

	function renderUserActions() {
		const el = $("#userActions");
		if (session) {
			const u = getUser(session.id) || session;
			const avEmoji = u.avatarEmoji || "";
			el.innerHTML =
				'<div class="avatar-wrap" id="avatarWrap">' +
					'<div class="avatar avatar-btn" style="background:' + session.color + '">' + (avEmoji || initials(session.name)) + '</div>' +
					'<span class="rank-badge" style="--rc:' + rankColor(session.role) + '">' + rankInfo(session.role).icon + '</span>' +
					'<div class="profile-dropdown" id="profileDropdown" hidden>' +
						'<div class="dropdown-header">' +
							'<div class="avatar" style="background:' + session.color + ';width:48px;height:48px">' + (avEmoji || initials(session.name)) + '</div>' +
							'<div><div class="dropdown-name">' + escapeHtml(session.name) + '</div><div>' + rankBadge(session.role) + '</div></div>' +
						'</div>' +
						'<a href="#/profile/' + session.id + '" class="dropdown-item">👤 Мой профиль</a>' +
						'<a href="#/settings" class="dropdown-item">⚙️ Настройки профиля</a>' +
						'<a href="#/members" class="dropdown-item">👥 Участники</a>' +
						(hasAdminAccess(session) ? '<a href="#/admin" class="dropdown-item">🛡️ Админ-панель</a>' : '') +
						'<div class="dropdown-divider"></div>' +
						'<button class="dropdown-item dropdown-danger" id="logoutBtn">🚪 Выйти</button>' +
					'</div>' +
				'</div>';
			const wrap = $("#avatarWrap");
			const dd = $("#profileDropdown");
			wrap.querySelector(".avatar-btn").onclick = (e) => {
				e.stopPropagation();
				dd.hidden = !dd.hidden;
			};
			dd.addEventListener("click", (e) => e.stopPropagation());
			document.addEventListener("click", () => { if (!dd.hidden) dd.hidden = true; });
			$("#logoutBtn").onclick = () => { setSession(null); session = null; sessionStorage.removeItem(GATE_KEY); renderUserActions(); router(); };
		} else {
			el.innerHTML = '<button class="btn btn-ghost" data-route="#/login">Вход</button><button class="btn btn-primary" data-route="#/register">Регистрация</button>';
			el.querySelectorAll("[data-route]").forEach((b) => b.onclick = () => location.hash = b.dataset.route);
		}
	}

	/* ===== Verification Gate ===== */
	function viewGate() {
		render(
			'<div class="gate-screen">' +
				'<div class="gate-card">' +
					'<div class="gate-logo"><span class="logo-mark" style="width:64px;height:64px;font-size:36px">R</span></div>' +
					'<h1 class="gate-title">RPM Forum</h1>' +
					'<p class="gate-subtitle">Игровое сообщество RolePlay проекта</p>' +
					'<div class="gate-features">' +
						'<div class="gate-feat"><span>📂</span> Разделы и подфорумы</div>' +
						'<div class="gate-feat"><span>💬</span> Обсуждения и жалобы</div>' +
						'<div class="gate-feat"><span>👥</span> Сообщество игроков</div>' +
					'</div>' +
					'<div class="gate-actions">' +
						'<button class="btn btn-primary gate-btn-big" id="gateLoginBtn">🔑 Вход</button>' +
						'<button class="btn btn-ghost gate-btn-big" id="gateRegBtn">📝 Регистрация</button>' +
					'</div>' +
					'<div class="gate-divider"><span>или</span></div>' +
					'<button class="btn btn-ghost gate-guest-btn" id="gateGuestBtn">👁️ Продолжить как гость</button>' +
					'<div class="gate-note">Гости могут читать темы, но не могут писать</div>' +
				'</div>' +
			'</div>'
		);
		$("#gateLoginBtn").onclick = () => { sessionStorage.setItem(GATE_KEY, "1"); location.hash = "#/login"; };
		$("#gateRegBtn").onclick = () => { sessionStorage.setItem(GATE_KEY, "1"); location.hash = "#/register"; };
		$("#gateGuestBtn").onclick = () => {
			sessionStorage.setItem(GATE_KEY, "1");
			location.hash = "#/";
			router();
		};
	}

	function isGatePassed() {
		return sessionStorage.getItem(GATE_KEY) === "1" || session !== null;
	}

	function viewHome() {
		const totalThreads = data.threads.length;
		const totalPosts = data.threads.reduce((s, t) => s + t.posts.length, 0);
		const lastUser = data.users.length ? data.users[data.users.length - 1] : null;
		const stats =
			'<section class="stats-banner">' +
				'<div class="stat-card"><div class="label">Тем</div><div class="value">' + fmt(totalThreads) + "</div></div>" +
				'<div class="stat-card"><div class="label">Сообщений</div><div class="value">' + fmt(totalPosts) + "</div></div>" +
				'<div class="stat-card"><div class="label">Участников</div><div class="value">' + fmt(data.users.length) + "</div></div>" +
				'<div class="stat-card"><div class="label">Новый участник</div><div class="value" style="font-size:14px">' + (lastUser ? escapeHtml(lastUser.name) : "—") + "</div></div>" +
			"</section>";

		const cats = data.categories.map((cat) => {
			return '<section class="category">' +
				'<div class="category-head"><h2>' + escapeHtml(cat.title) + "</h2></div>" +
				cat.forums.map((f) => {
					const fThreads = forumThreads(f.id);
					const last = fThreads.length ? fThreads.sort((a, b) => b.created - a.created)[0] : null;
					const lastUser2 = last ? getUser(last.author) : null;
					const subLinks = (f.subforums && f.subforums.length)
						? '<div class="forum-subs">Подразделы: ' + f.subforums.map((s) => '<a href="#/forum/' + s.id + '">' + escapeHtml(s.name) + "</a>").join(" · ") + "</div>"
						: "";
					return '<div class="forum-row" data-go="#/forum/' + f.id + '">' +
						'<div class="forum-icon">' + f.icon + "</div>" +
						'<div class="forum-meta">' +
							"<h3>" + escapeHtml(f.name) + "</h3>" +
							"<p>" + escapeHtml(f.desc) + "</p>" +
							subLinks +
							(last ? '<div class="forum-lastpost">Последняя: ' + escapeHtml(last.title) + (lastUser2 ? " · " + escapeHtml(lastUser2.name) : "") + "</div>" : "") +
						"</div>" +
						'<div class="forum-stats">' +
							"<strong>" + fmt(f.threads) + "</strong> тем" +
							"<strong>" + fmt(f.posts) + "</strong> сообщений" +
						"</div>" +
					"</div>";
				}).join("") +
			"</section>";
		}).join("");

		render(stats + cats);
		bindGo();
	}

	function viewForum(fid) {
		const forum = getForum(fid);
		if (!forum) return render(notFound());
		const parent = getParentForum(fid);
		const threads = forumThreads(fid).sort((a, b) => (b.pinned - a.pinned) || (b.created - a.created));

		/* Subforum list section */
		let subSection = "";
		if (forum.subforums && forum.subforums.length) {
			subSection = '<div class="subforum-list">' +
				'<div class="subforum-head">📁 Подразделы</div>' +
				forum.subforums.map((s) => {
					const sThreads = forumThreads(s.id);
					return '<div class="subforum-row" data-go="#/forum/' + s.id + '">' +
						'<div class="forum-icon-sm">' + s.icon + "</div>" +
						'<div style="flex:1">' +
							"<strong>" + escapeHtml(s.name) + "</strong>" +
							'<div class="muted-sm">' + escapeHtml(s.desc) + "</div>" +
						"</div>" +
						'<div class="muted-sm" style="text-align:right;white-space:nowrap">' + fmt(s.threads) + " тем · " + fmt(s.posts) + " сообщ.</div>" +
					"</div>";
				}).join("") +
			"</div>";
		}

		const rows = threads.length ? threads.map((t) => {
			const u = getUser(t.author);
			const last = t.posts[t.posts.length - 1];
			return '<div class="thread-row" data-go="#/thread/' + t.id + '">' +
				'<div class="avatar" style="background:' + (u ? u.color : "#888") + '">' + (u ? (u.avatarEmoji || initials(u.name)) : "?") + "</div>" +
				'<div class="thread-info">' +
					"<h3>" + (t.pinned ? '<span class="tag tag-pinned">Закреп</span>' : "") + (t.closed ? '<span class="tag tag-closed">Закрыта</span>' : "") + '<a href="#/thread/' + t.id + '">' + escapeHtml(t.title) + "</a></h3>" +
					'<div class="thread-meta">' + (u ? escapeHtml(u.name) : "?") + " " + (u ? rankBadge(u.role) : "") + " · " + timeAgo(t.created) + " · " + fmt(t.views) + " просмотров</div>" +
				"</div>" +
				'<div class="thread-stats"><strong>' + t.posts.length + "</strong> ответов<br>" + (last ? timeAgo(last.created) : "") + "</div>" +
			"</div>";
		}).join("") : '<div class="empty-state"><div class="big">📭</div>В этом разделе пока нет тем.<br>' + (session ? "Создай первую!" : "Войди, чтобы создать тему.") + "</div>";

		const newBtn = session ? '<button class="btn btn-primary" data-go="#/new/' + fid + '">＋ Новая тема</button>' : "";
		const addSubBtn = (session && hasAdminAccess(session) && !parent) ? '<button class="btn btn-ghost" data-go="#/newsub/' + fid + '">＋ Подраздел</button>' : "";

		/* Breadcrumb */
		let crumb = '<div class="breadcrumb"><a href="#/">Главная</a><span>›</span>';
		if (parent) crumb += '<a href="#/forum/' + parent.id + '">' + escapeHtml(parent.name) + '</a><span>›</span><span>' + escapeHtml(forum.name) + "</span>";
		else crumb += "<span>" + escapeHtml(forum.name) + "</span>";
		crumb += "</div>";

		render(
			crumb +
			'<div class="page-head"><div class="page-title"><h1>' + forum.icon + " " + escapeHtml(forum.name) + '</h1></div>' + addSubBtn + newBtn + "</div>" +
			subSection +
			'<div class="thread-list">' + rows + "</div>"
		);
		bindGo();
	}

	function viewThread(tid) {
		const t = getThread(tid);
		if (!t) return render(notFound());
		const forum = getForum(t.forumId);
		const parent = forum ? getParentForum(forum.id) : null;
		t.views++;
		saveData(data);

		const posts = t.posts.map((p) => {
			const u = getUser(p.author) || { name: "Удалён", role: "—", color: "#888", posts: 0, joined: 0, id: 0 };
			const avEmoji = u.avatarEmoji || "";
			return '<article class="post">' +
				'<aside class="post-aside">' +
					'<a href="#/profile/' + u.id + '" class="avatar avatar-link" style="background:' + u.color + '">' + (avEmoji || initials(u.name)) + '</a>' +
					'<div class="post-author"><a href="#/profile/' + u.id + '">' + escapeHtml(u.name) + '</a></div>' +
					'<div class="post-role">' + rankBadge(u.role) + "</div>" +
					'<div class="post-stats">Сообщений: ' + fmt(u.posts) + "<br>С нами с: " + new Date(u.joined).toLocaleDateString("ru-RU") + "</div>" +
				"</aside>" +
				'<div class="post-body">' +
					'<div class="post-date">' + timeAgo(p.created) + "</div>" +
					'<div class="post-content">' + escapeHtml(p.content).replace(/\n/g, "<br>") + "</div>" +
					'<div class="post-actions"><button>👍 Нравится</button><button>💬 Цитировать</button><button>⚠ Жалоба</button></div>' +
				"</div>" +
			"</article>";
		}).join("");

		const reply = session && !t.closed ?
			'<div class="reply-box"><h3>Ваш ответ</h3><textarea id="replyText" placeholder="Напишите ответ..."></textarea><div class="actions"><button class="btn btn-primary" id="postReply">Отправить</button></div></div>'
			: (!session ? '<div class="empty-state">Войдите, чтобы ответить в теме.</div>' : '<div class="empty-state">🔒 Тема закрыта для ответов.</div>');

		let crumb = '<div class="breadcrumb"><a href="#/">Главная</a><span>›</span>';
		if (parent) crumb += '<a href="#/forum/' + parent.id + '">' + escapeHtml(parent.name) + '</a><span>›</span>';
		if (forum) crumb += '<a href="#/forum/' + forum.id + '">' + escapeHtml(forum.name) + '</a><span>›</span>';
		crumb += "<span>" + escapeHtml(t.title) + "</span></div>";

		render(
			crumb +
			'<div class="page-head"><div class="page-title"><h1>' + escapeHtml(t.title) + "</h1></div></div>" +
			posts + reply
		);
		if (session && !t.closed) {
			$("#postReply").onclick = () => {
				const text = $("#replyText").value.trim();
				if (!text) return;
				t.posts.push({ author: session.id, created: Date.now(), content: text });
				const u = getUser(session.id);
				if (u) { u.posts++; saveData(data); }
				router();
			};
		}
	}

	function viewNewThread(fid) {
		if (!session) { location.hash = "#/login"; return; }
		const forum = getForum(fid);
		if (!forum) return render(notFound());
		const parent = getParentForum(fid);

		let crumb = '<div class="breadcrumb"><a href="#/">Главная</a><span>›</span>';
		if (parent) crumb += '<a href="#/forum/' + parent.id + '">' + escapeHtml(parent.name) + '</a><span>›</span>';
		crumb += '<a href="#/forum/' + fid + '">' + escapeHtml(forum.name) + '</a><span>›</span><span>Новая тема</span></div>';

		render(
			crumb +
			'<div class="page-head"><div class="page-title"><h1>Новая тема</h1></div></div>' +
			'<div class="reply-box new-thread">' +
				'<div class="field"><label>Заголовок</label><input type="text" id="threadTitle" placeholder="Краткое название темы"></div>' +
				'<div class="field"><label>Сообщение</label>' +
					'<div class="editor-tools">' +
						'<button data-tag="**" title="Жирный">B</button>' +
						'<button data-tag="*" title="Курсив">I</button>' +
						'<button data-tag="__" title="Подчёркнутый">U</button>' +
						'<button data-tag="\n> " title="Цитата">"</button>' +
					"</div>" +
					'<textarea id="threadBody" placeholder="Текст темы..."></textarea>' +
				"</div>" +
				'<div class="actions"><button class="btn btn-ghost" data-go="#/forum/' + fid + '">Отмена</button><button class="btn btn-primary" id="submitThread">Создать тему</button></div>' +
			"</div>"
		);
		bindGo();
		$("#submitThread").onclick = () => {
			const title = $("#threadTitle").value.trim();
			const body = $("#threadBody").value.trim();
			if (!title || !body) return alert("Заполните заголовок и сообщение");
			const newId = Date.now();
			data.threads.unshift({ id: newId, forumId: fid, title, author: session.id, created: Date.now(), posts: [{ author: session.id, created: Date.now(), content: body }], pinned: false, closed: false, views: 0 });
			const u = getUser(session.id);
			if (u) { u.posts++; }
			saveData(data);
			location.hash = "#/thread/" + newId;
		};
		document.querySelectorAll(".editor-tools button").forEach((b) => {
			b.onclick = () => {
				const ta = $("#threadBody");
				ta.value += b.dataset.tag.replace(/\\n/g, "\n");
				ta.focus();
			};
		});
	}

	function viewNewSubforum(fid) {
		if (!session || !hasAdminAccess(session)) { location.hash = "#/forum/" + fid; return; }
		const forum = getForum(fid);
		if (!forum) return render(notFound());

		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><a href="#/forum/' + fid + '">' + escapeHtml(forum.name) + '</a><span>›</span><span>Новый подраздел</span></div>' +
			'<div class="page-head"><div class="page-title"><h1>Новый подраздел</h1></div></div>' +
			'<div class="reply-box new-thread">' +
				'<div class="field"><label>Иконка</label><input type="text" id="subIcon" placeholder="📁" maxlength="4" value="📋" style="width:80px"></div>' +
				'<div class="field"><label>Название подраздела</label><input type="text" id="subName" placeholder="Например: Министерства"></div>' +
				'<div class="field"><label>Описание</label><input type="text" id="subDesc" placeholder="Краткое описание"></div>' +
				'<div class="actions"><button class="btn btn-ghost" data-go="#/forum/' + fid + '">Отмена</button><button class="btn btn-primary" id="submitSub">Создать подраздел</button></div>' +
			"</div>"
		);
		bindGo();
		$("#submitSub").onclick = () => {
			const icon = $("#subIcon").value.trim() || "📋";
			const name = $("#subName").value.trim();
			const desc = $("#subDesc").value.trim();
			if (!name) return alert("Введите название подраздела");
			if (!forum.subforums) forum.subforums = [];
			forum.subforums.push({ id: "sub_" + Date.now(), icon, name, desc: desc || "Без описания", threads: 0, posts: 0 });
			saveData(data);
			location.hash = "#/forum/" + fid;
		};
	}

	function viewAuth(mode) {
		const isLogin = mode === "login";
		render(
			'<div class="auth-card">' +
				"<h2>" + (isLogin ? "Вход на форум" : "Регистрация") + "</h2>" +
				'<div class="sub">' + (isLogin ? "Войдите, чтобы участвовать в обсуждениях" : "Создайте аккаунт за минуту") + "</div>" +
				(!isLogin ? '<div class="field"><label>Имя пользователя</label><input type="text" id="authName"></div>' : "") +
				'<div class="field"><label>Логин</label><input type="text" id="authLogin" placeholder="' + (isLogin ? "Ваш логин" : "Придумайте логин") + '"></div>' +
				'<div class="field"><label>Пароль</label><input type="password" id="authPass" placeholder="Пароль"></div>' +
				'<button class="btn btn-primary" id="authSubmit">' + (isLogin ? "Войти" : "Зарегистрироваться") + "</button>" +
				'<div class="auth-switch">' + (isLogin ? 'Нет аккаунта? <a href="#/register">Регистрация</a>' : 'Уже есть аккаунт? <a href="#/login">Войти</a>') + "</div>" +
				(!isLogin ? '<div class="gate-note" style="margin-top:12px">После регистрации вы получите ранг «Игрок»</div>' : "") +
			"</div>"
		);
		$("#authSubmit").onclick = () => {
			const login = $("#authLogin").value.trim();
			const pass = $("#authPass").value;
			if (!login || !pass) return alert("Заполните все поля");
			if (isLogin) {
				const accKey = "rpmforum_acc_" + login;
				const saved = localStorage.getItem(accKey);
				if (!saved) return alert("Аккаунт не найден. Зарегистрируйтесь.");
				const acc = JSON.parse(saved);
				if (acc.pass !== pass) return alert("Неверный пароль");
				const dbUser = data.users.find((u) => u.id === acc.id);
				const roleName = dbUser ? dbUser.role : (isGosha(acc.name) ? "Руководство Проекта" : "Игрок");
				if (isGosha(acc.name) && dbUser && dbUser.role !== "Руководство Проекта") {
					dbUser.role = "Руководство Проекта";
					saveData(data);
				}
				session = { id: acc.id, name: acc.name, role: isGosha(acc.name) ? "Руководство Проекта" : roleName, color: acc.color };
				let dbu = data.users.find((x) => x.id === acc.id);
				if (!dbu) {
					dbu = { id: acc.id, name: acc.name, role: session.role, color: acc.color, joined: Date.now(), posts: 0 };
					data.users.push(dbu);
					saveData(data);
				}
				session.role = dbu.role;
				session.color = dbu.color || acc.color;
				setSession(session);
			} else {
				const name = $("#authName").value.trim() || login;
				if (localStorage.getItem("rpmforum_acc_" + login)) return alert("Логин занят");
				const id = Date.now();
				const role = isGosha(name) ? "Руководство Проекта" : "Игрок";
				const color = isGosha(name) ? "#ff0033" : avatarColor(name);
				const acc = { id, name, login, pass, color };
				localStorage.setItem("rpmforum_acc_" + login, JSON.stringify(acc));
				data.users.push({ id, name, role, color, joined: Date.now(), posts: 0 });
				saveData(data);
				session = { id, name, role, color };
				setSession(session);
			}
			sessionStorage.setItem(GATE_KEY, "1");
			renderUserActions();
			location.hash = "#/";
		};
	}

	function viewMembers() {
		const sorted = [...data.users].sort((a, b) => (rankInfo(b.role).priority - rankInfo(a.role).priority) || (b.posts - a.posts));
		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Участники</span></div>' +
			'<div class="page-head"><div class="page-title"><h1>Участники сообщества</h1></div></div>' +
			'<div class="thread-list">' +
				sorted.map((u) =>
					'<div class="thread-row members-row" data-go="#/profile/' + u.id + '">' +
						'<div class="avatar" style="background:' + u.color + ';width:48px;height:48px">' + (u.avatarEmoji || initials(u.name)) + "</div>" +
						'<div class="thread-info">' +
							"<h3>" + escapeHtml(u.name) + " " + rankBadge(u.role) + "</h3>" +
							'<div class="thread-meta">С нами с ' + new Date(u.joined).toLocaleDateString("ru-RU") + "</div>" +
						"</div>" +
						'<div class="thread-stats"><strong>' + fmt(u.posts) + "</strong> сообщений</div>" +
					"</div>"
				).join("") +
			"</div>"
		);
	}

	function viewNew() {
		const recent = [...data.threads].sort((a, b) => b.created - a.created).slice(0, 20);
		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Новые сообщения</span></div>' +
			'<div class="page-head"><div class="page-title"><h1>Новые сообщения</h1></div></div>' +
			'<div class="thread-list">' +
				recent.map((t) => {
					const u = getUser(t.author);
					const f = getForum(t.forumId);
					return '<div class="thread-row" data-go="#/thread/' + t.id + '">' +
						'<div class="avatar" style="background:' + (u ? u.color : "#888") + '">' + (u ? (u.avatarEmoji || initials(u.name)) : "?") + "</div>" +
						'<div class="thread-info">' +
							"<h3><a href=\"#/thread/" + t.id + '">' + escapeHtml(t.title) + "</a></h3>" +
							'<div class="thread-meta">' + escapeHtml(f ? f.name : "") + " · " + (u ? escapeHtml(u.name) : "?") + " " + (u ? rankBadge(u.role) : "") + " · " + timeAgo(t.created) + "</div>" +
						"</div>" +
						'<div class="thread-stats"><strong>' + t.posts.length + "</strong> ответов</div>" +
					"</div>";
				}).join("") +
			"</div>"
		);
		bindGo();
	}

	function viewRules() {
		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Правила</span></div>' +
			'<div class="reply-box">' +
				"<h2>Правила форума</h2><br>" +
				'<div class="post-content">' +
					"<p><strong>1. Уважение.</strong> Оскорбления, дискриминация и травля запрещены.</p>" +
					"<p><strong>2. Язык.</strong> Общение на русском языке. Без мата и нецензурной лексики.</p>" +
					"<p><strong>3. Разделы.</strong> Создавайте темы в соответствующих разделах.</p>" +
					"<p><strong>4. Реклама.</strong> Реклама сторонних проектов без согласования запрещена.</p>" +
					"<p><strong>5. Флуд.</strong> Не создавайте дубли тем и не флудите оффтопом.</p>" +
					"<p><strong>6. Контент.</strong> Запрещён NSFW-контент, призывы к нарушению закона.</p>" +
					"<p>Нарушение правил ведёт к предупреждению, муту или бану.</p>" +
				"</div>" +
			"</div>"
		);
	}

	function viewSearch(q) {
		const ql = q.toLowerCase();
		const found = data.threads.filter((t) => t.title.toLowerCase().includes(ql) || t.posts.some((p) => p.content.toLowerCase().includes(ql)));
		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Поиск</span></div>' +
			'<div class="page-head"><div class="page-title"><h1>Результаты: "' + escapeHtml(q) + '"</h1></div></div>' +
			'<div class="thread-list">' +
				(found.length ? found.map((t) => {
					const u = getUser(t.author);
					return '<div class="thread-row" data-go="#/thread/' + t.id + '">' +
						'<div class="avatar" style="background:' + (u ? u.color : "#888") + '">' + (u ? (u.avatarEmoji || initials(u.name)) : "?") + "</div>" +
						'<div class="thread-info"><h3><a href="#/thread/' + t.id + '">' + escapeHtml(t.title) + '</a></h3><div class="thread-meta">' + timeAgo(t.created) + "</div></div>" +
						'<div class="thread-stats"><strong>' + t.posts.length + "</strong> ответов</div>" +
					"</div>";
				}).join("") : '<div class="empty-state"><div class="big">🔍</div>Ничего не найдено.</div>') +
			"</div>"
		);
		bindGo();
	}

	function viewAdmin(section) {
		section = section || "dashboard";
		const sessionAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
		const userAdmin = session && hasAdminAccess(session);
		if (!sessionAdmin && !userAdmin) return viewAdminLogin();

		const adminNav =
			'<nav class="admin-nav">' +
				'<a href="#/admin" class="' + (section === "dashboard" ? "active" : "") + '">📊 Дашборд</a>' +
				'<a href="#/admin/forums" class="' + (section === "forums" ? "active" : "") + '">📂 Разделы</a>' +
				'<a href="#/admin/threads" class="' + (section === "threads" ? "active" : "") + '">💬 Темы</a>' +
				'<a href="#/admin/users" class="' + (section === "users" ? "active" : "") + '">👥 Пользователи</a>' +
				'<a href="#/" style="margin-left:auto;color:var(--text-mute)">← На форум</a>' +
			"</nav>";

		let content = "";
		if (section === "dashboard") content = adminDashboard();
		else if (section === "forums") content = adminForums();
		else if (section === "threads") content = adminThreads();
		else if (section === "users") content = adminUsers();

		render(
			'<div class="admin-wrap">' +
				'<div class="admin-header"><h1>⚡ Админ-панель</h1>' +
					'<div class="admin-header-right">' +
						(session && isGosha(session.name) ? '<span class="rank-badge" style="--rc:#ff0033;font-size:12px">👑 Гоша</span>' : "") +
						'<span class="admin-save-status" id="adminSaveStatus">💾 Всё сохраняется автоматически</span>' +
						'<button class="btn btn-ghost" id="adminReload">🔄 Обновить данные</button>' +
						'<button class="btn btn-danger" id="adminLogout">Выйти</button>' +
					'</div>' +
				'</div>' +
				adminNav +
				'<div class="admin-body">' + content + "</div>" +
			"</div>"
		);
		$("#adminLogout").onclick = () => { sessionStorage.removeItem(ADMIN_SESSION_KEY); location.hash = "#/"; };
		$("#adminReload").onclick = () => { data = loadData(); ensureGoshaAdmin(); viewAdmin(section); };
		bindAdminActions();
	}

	function viewAdminLogin() {
		render(
			'<div class="auth-card">' +
				"<h2>🔒 Вход в админ-панель</h2>" +
				'<div class="sub">Введите мастер-пароль или войдите как администратор</div>' +
				'<div class="field"><label>Мастер-пароль</label><input type="password" id="adminPass" placeholder="Пароль"></div>' +
				'<button class="btn btn-primary" id="adminLoginBtn">Войти</button>' +
				'<div class="auth-switch"><a href="#/">← На главную</a></div>' +
			"</div>"
		);
		$("#adminLoginBtn").onclick = () => {
			if ($("#adminPass").value === ADMIN_PASSWORD) {
				sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
				router();
			} else {
				alert("Неверный пароль");
			}
		};
	}

	function adminDashboard() {
		const totalThreads = data.threads.length;
		const totalPosts = data.threads.reduce((s, t) => s + t.posts.length, 0);
		const totalForums = data.categories.reduce((s, c) => s + c.forums.length, 0);
		let totalSubs = 0;
		data.categories.forEach((c) => c.forums.forEach((f) => { if (f.subforums) totalSubs += f.subforums.length; }));
		return (
			'<div class="stats-banner">' +
				'<div class="stat-card"><div class="label">Категорий</div><div class="value">' + data.categories.length + "</div></div>" +
				'<div class="stat-card"><div class="label">Разделов</div><div class="value">' + totalForums + "</div></div>" +
				'<div class="stat-card"><div class="label">Подразделов</div><div class="value">' + totalSubs + "</div></div>" +
				'<div class="stat-card"><div class="label">Тем</div><div class="value">' + fmt(totalThreads) + "</div></div>" +
			"</div>" +
			'<div class="admin-card">' +
				"<h3>Быстрые действия</h3>" +
				'<div class="admin-quick">' +
					'<a href="#/admin/forums" class="quick-btn">📂 Управление разделами</a>' +
					'<a href="#/admin/threads" class="quick-btn">💬 Управление темами</a>' +
					'<a href="#/admin/users" class="quick-btn">👥 Управление пользователями</a>' +
				"</div>" +
			"</div>"
		);
	}

	function adminForums() {
		const catList = data.categories.map((cat) =>
			'<div class="admin-card">' +
				"<h3>" + escapeHtml(cat.title) + ' <span class="muted">(' + cat.forums.length + ")</span></h3>" +
				'<div class="admin-table">' +
					cat.forums.map((f) => {
						let subHtml = "";
						if (f.subforums && f.subforums.length) {
							subHtml = f.subforums.map((s) =>
								'<div class="admin-row admin-sub-row">' +
									'<span class="forum-icon-sm">' + s.icon + "</span>" +
									"<div><strong>" + escapeHtml(s.name) + "</strong> <span class=\"sub-badge\">подраздел</span><br><span class=\"muted\">" + escapeHtml(s.desc) + "</span></div>" +
									'<button class="btn btn-danger btn-sm" data-del-sub="' + f.id + "|" + s.id + '">Удалить</button>' +
								"</div>"
							).join("");
						}
						return '<div class="admin-row admin-forum-row">' +
							'<span class="forum-icon-sm">' + f.icon + "</span>" +
							"<div><strong>" + escapeHtml(f.name) + "</strong>" + (f.subforums && f.subforums.length ? ' <span class="sub-badge">' + f.subforums.length + " подразд.</span>" : "") + "<br><span class=\"muted\">" + escapeHtml(f.desc) + "</span></div>" +
							'<div class="muted">' + fmt(f.threads) + " тем / " + fmt(f.posts) + " сообщ.</div>" +
							'<div class="admin-row-btns">' +
								'<button class="btn btn-ghost btn-sm" data-add-sub="' + f.id + '">＋ Подраздел</button>' +
								'<button class="btn btn-danger btn-sm" data-del-forum="' + cat.id + "|" + f.id + '">Удалить</button>' +
							"</div>" +
						"</div>" + subHtml;
					}).join("") +
				"</div>" +
			"</div>"
		).join("");

		return (
			'<div class="admin-card">' +
				"<h3>➕ Добавить раздел</h3>" +
				'<div class="admin-form">' +
					'<select id="newForumCat">' +
						data.categories.map((c) => '<option value="' + c.id + '">' + escapeHtml(c.title) + "</option>").join("") +
					"</select>" +
					'<input type="text" id="newForumIcon" placeholder="Иконка" maxlength="4" value="📋">' +
					'<input type="text" id="newForumName" placeholder="Название раздела">' +
					'<input type="text" id="newForumDesc" placeholder="Описание">' +
					'<button class="btn btn-primary" id="addForumBtn">Добавить</button>' +
				"</div>" +
			"</div>" +
			catList
		);
	}

	function adminThreads() {
		const rows = [...data.threads].sort((a, b) => b.created - a.created).map((t) => {
			const u = getUser(t.author);
			const f = getForum(t.forumId);
			return '<div class="admin-row">' +
				"<div><strong>" + escapeHtml(t.title) + "</strong><br><span class=\"muted\">" + escapeHtml(f ? f.name : "?") + " · " + (u ? escapeHtml(u.name) : "?") + "</span></div>" +
				'<div class="muted">' + t.posts.length + " ответов · " + fmt(t.views) + " просм.</div>" +
				'<div class="admin-row-btns">' +
					'<button class="btn btn-ghost btn-sm" data-pin-thread="' + t.id + '">' + (t.pinned ? "Открепить" : "Закрепить") + "</button>" +
					'<button class="btn btn-ghost btn-sm" data-close-thread="' + t.id + '">' + (t.closed ? "Открыть" : "Закрыть") + "</button>" +
					'<button class="btn btn-danger btn-sm" data-del-thread="' + t.id + '">Удалить</button>' +
				"</div>" +
			"</div>";
		}).join("");
		return '<div class="admin-card"><h3>Все темы (' + data.threads.length + ')</h3><div class="admin-table">' + rows + "</div></div>";
	}

	function adminUsers() {
		const rows = [...data.users].sort((a, b) => rankInfo(b.role).priority - rankInfo(a.role).priority || a.id - b.id).map((u) => {
			const locked = isGosha(u.name);
			return '<div class="admin-row' + (locked ? " admin-row-locked" : "") + '">' +
				'<div class="avatar" style="background:' + u.color + ';width:40px;height:40px">' + (u.avatarEmoji || initials(u.name)) + "</div>" +
				"<div><strong>" + escapeHtml(u.name) + "</strong> " + rankBadge(u.role) + (locked ? ' <span class="gosha-lock">🔒 защищён</span>' : "") + "<br><span class=\"muted\">" + fmt(u.posts) + " сообщений · ID " + u.id + "</span></div>" +
				'<select class="role-select" data-role-user="' + u.id + '"' + (locked ? " disabled" : "") + ">" +
					RANK_KEYS.map((r) => '<option value="' + r + '"' + (u.role === r ? " selected" : "") + ">" + RANKS[r].icon + " " + r + "</option>").join("") +
				"</select>" +
				(locked ? '<span class="muted">нельзя удалить</span>' : '<button class="btn btn-danger btn-sm" data-del-user="' + u.id + '">🗑️ Удалить</button>') +
			"</div>";
		}).join("");
		return '<div class="admin-card"><h3>Пользователи (' + data.users.length + ")</h3>" +
			'<div class="rank-info-box">💡 Выдавайте ранги через выпадающий список — изменения сохраняются автоматически. Ранг Гоши защищён.</div>' +
			'<div class="admin-table">' + rows + "</div></div>";
	}

	function adminSaved(section) {
		const ok = saveData(data);
		if (ok) {
			data = loadData();
			viewAdmin(section);
			const st = document.getElementById("adminSaveStatus");
			if (st) {
				const orig = st.textContent;
				st.textContent = "✅ Сохранено!";
				st.style.color = "#4ade80";
				setTimeout(() => { if (st) { st.textContent = orig; st.style.color = ""; } }, 2000);
			}
		}
	}

	function bindAdminActions() {
		document.querySelectorAll("[data-del-forum]").forEach((b) => {
			b.onclick = () => {
				const [catId, fid] = b.dataset.delForum.split("|");
				if (!confirm("Удалить раздел? Все темы и подразделы будут удалены.")) return;
				const cat = data.categories.find((c) => c.id === catId);
				if (cat) cat.forums = cat.forums.filter((f) => f.id !== fid);
				data.threads = data.threads.filter((t) => t.forumId !== fid);
				adminSaved("forums");
			};
		});
		document.querySelectorAll("[data-del-sub]").forEach((b) => {
			b.onclick = () => {
				const [fid, sid] = b.dataset.delSub.split("|");
				if (!confirm("Удалить подраздел? Все темы в нём будут удалены.")) return;
				const f = getForum(fid);
				if (f && f.subforums) {
					f.subforums = f.subforums.filter((s) => s.id !== sid);
				}
				data.threads = data.threads.filter((t) => t.forumId !== sid);
				adminSaved("forums");
			};
		});
		document.querySelectorAll("[data-add-sub]").forEach((b) => {
			b.onclick = () => { location.hash = "#/newsub/" + b.dataset.addSub; };
		});
		const addBtn = document.getElementById("addForumBtn");
		if (addBtn) {
			addBtn.onclick = () => {
				const catId = $("#newForumCat").value;
				const icon = $("#newForumIcon").value.trim() || "📋";
				const name = $("#newForumName").value.trim();
				const desc = $("#newForumDesc").value.trim();
				if (!name) return alert("Введите название раздела");
				const cat = data.categories.find((c) => c.id === catId);
				cat.forums.push({ id: "f" + Date.now(), icon, name, desc: desc || "Без описания", threads: 0, posts: 0 });
				adminSaved("forums");
			};
		}
		document.querySelectorAll("[data-del-thread]").forEach((b) => {
			b.onclick = () => {
				if (!confirm("Удалить тему?")) return;
				data.threads = data.threads.filter((t) => t.id !== Number(b.dataset.delThread));
				adminSaved("threads");
			};
		});
		document.querySelectorAll("[data-pin-thread]").forEach((b) => {
			b.onclick = () => {
				const t = data.threads.find((x) => x.id === Number(b.dataset.pinThread));
				if (t) { t.pinned = !t.pinned; adminSaved("threads"); }
			};
		});
		document.querySelectorAll("[data-close-thread]").forEach((b) => {
			b.onclick = () => {
				const t = data.threads.find((x) => x.id === Number(b.dataset.closeThread));
				if (t) { t.closed = !t.closed; adminSaved("threads"); }
			};
		});
		document.querySelectorAll("[data-role-user]").forEach((sel) => {
			sel.onchange = () => {
				const u = data.users.find((x) => x.id === Number(sel.dataset.roleUser));
				if (u) {
					u.role = sel.value;
					if (session && session.id === u.id) {
						session.role = u.role;
						setSession(session);
					}
					adminSaved("users");
				}
			};
		});
		document.querySelectorAll("[data-del-user]").forEach((b) => {
			b.onclick = () => {
				const uid = Number(b.dataset.delUser);
				const u = data.users.find((x) => x.id === uid);
				if (!u) return;
				if (!confirm('Удалить пользователя "' + u.name + '"? Это действие необратимо.')) return;
				data.users = data.users.filter((x) => x.id !== uid);
				adminSaved("users");
			};
		});
	}

	function viewProfile(uid) {
		const numId = Number(uid);
		let u = getUser(numId);
		if (!u) {
			if (session && session.id === numId) {
				u = { id: session.id, name: session.name, role: session.role, color: session.color, joined: Date.now(), posts: 0 };
				data.users.push(u);
				saveData(data);
			} else {
				return render(notFound());
			}
		}
		const avEmoji = u.avatarEmoji || "";
		const userThreads = data.threads.filter((t) => t.author === u.id);
		const isOwn = session && session.id === u.id;

		const lastThreads = userThreads.slice(0, 10).map((t) => {
			const f = getForum(t.forumId);
			return '<div class="thread-row" data-go="#/thread/' + t.id + '">' +
				'<div class="thread-info" style="grid-column:1/-1">' +
					'<h3><a href="#/thread/' + t.id + '">' + escapeHtml(t.title) + '</a></h3>' +
					'<div class="thread-meta">' + escapeHtml(f ? f.name : "") + ' · ' + timeAgo(t.created) + ' · ' + t.posts.length + ' ответов · ' + fmt(t.views) + ' просмотров</div>' +
				'</div>' +
			'</div>';
		}).join("");

		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Профиль</span></div>' +
			'<div class="profile-page">' +
				'<div class="profile-banner" style="background:linear-gradient(135deg,' + u.color + ',var(--bg-soft))">' +
					'<div class="profile-banner-overlay"></div>' +
				'</div>' +
				'<div class="profile-header">' +
					'<div class="profile-avatar" style="background:' + u.color + '">' + (avEmoji || initials(u.name)) + '</div>' +
					'<div class="profile-info">' +
						'<h1>' + escapeHtml(u.name) + ' ' + rankBadge(u.role) + '</h1>' +
						'<div class="profile-meta">' +
							'<span>📅 С нами с ' + new Date(u.joined).toLocaleDateString("ru-RU") + '</span>' +
							'<span>💬 ' + fmt(u.posts) + ' сообщений</span>' +
							'<span>📝 ' + userThreads.length + ' тем</span>' +
						'</div>' +
					'</div>' +
					(isOwn ? '<button class="btn btn-primary" data-go="#/settings">⚙️ Изменить</button>' : '') +
				'</div>' +
				'<div class="profile-body">' +
					'<div class="profile-card">' +
						'<h3>📝 О себе</h3>' +
						'<div class="profile-bio">' + (u.bio ? escapeHtml(u.bio).replace(/\n/g, "<br>") : '<span class="muted">Пользователь ещё не заполнил описание.</span>') + '</div>' +
					'</div>' +
					'<div class="profile-card">' +
						'<h3>📊 Статистика</h3>' +
						'<div class="profile-stats-grid">' +
							'<div class="profile-stat"><div class="profile-stat-val">' + fmt(u.posts) + '</div><div class="profile-stat-label">Сообщений</div></div>' +
							'<div class="profile-stat"><div class="profile-stat-val">' + userThreads.length + '</div><div class="profile-stat-label">Тем создано</div></div>' +
							'<div class="profile-stat"><div class="profile-stat-val">' + new Date(u.joined).toLocaleDateString("ru-RU") + '</div><div class="profile-stat-label">Регистрация</div></div>' +
						'</div>' +
					'</div>' +
					(userThreads.length ?
						'<div class="profile-card">' +
							'<h3>📋 Последние темы</h3>' +
							'<div class="thread-list" style="box-shadow:none;border:none">' + lastThreads + '</div>' +
						'</div>'
						: "") +
				'</div>' +
			'</div>'
		);
		bindGo();
	}

	function viewSettings() {
		if (!session) { location.hash = "#/login"; return; }
		let u = getUser(session.id);
		if (!u) {
			u = { id: session.id, name: session.name, role: session.role, color: session.color, joined: Date.now(), posts: 0 };
			data.users.push(u);
			saveData(data);
		}
		if (!u) return render(notFound());
		const avEmoji = u.avatarEmoji || "";
		const colors = ["#6c8cff", "#00d4a8", "#ff6b9d", "#ffb84d", "#9b6cff", "#ff7849", "#3ecf8e", "#ff3838", "#ff6b1a", "#ff9500", "#60a5fa", "#a78bfa"];

		render(
			'<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><a href="#/profile/' + session.id + '">Профиль</a><span>›</span><span>Настройки</span></div>' +
			'<div class="page-head"><div class="page-title"><h1>⚙️ Настройки профиля</h1></div></div>' +
			'<div class="settings-page">' +
				'<div class="reply-box">' +
					'<div class="settings-preview">' +
						'<div class="settings-preview-label">Предпросмотр:</div>' +
						'<div class="avatar avatar-preview" id="avatarPreview" style="background:' + u.color + '">' + (avEmoji || initials(u.name)) + '</div>' +
						'<div><strong id="namePreview">' + escapeHtml(u.name) + '</strong><br>' + rankBadge(u.role) + '</div>' +
					'</div>' +

					'<div class="field">' +
						'<label>🎨 Цвет аватарки</label>' +
						'<div class="color-picker" id="colorPicker">' +
							colors.map((c) => '<button class="color-swatch' + (c === u.color ? " active" : "") + '" style="background:' + c + '" data-color="' + c + '"></button>').join("") +
						'</div>' +
					'</div>' +

					'<div class="field">' +
						'<label>😀 Эмодзи для аватарки (вместо инициалов)</label>' +
						'<div class="emoji-picker" id="emojiPicker">' +
							'<button class="emoji-btn' + (!avEmoji ? " active" : "") + '" data-emoji="">🚫 Нет</button>' +
							'🦊,🐱,🐺,🦁,🐯,🐻,🐼,🐨,🦝,🐰,🐹,🐸,🦅,🦉,🐲,🤖,👻,💀,🤡,👹,👾,🦾,⚡,🔥,⭐,💎,👑,🎯,🎮,🛡️,⚔️,🚀'.split(",").map((e) =>
								'<button class="emoji-btn' + (avEmoji === e ? " active" : "") + '" data-emoji="' + e + '">' + e + '</button>'
							).join("") +
						'</div>' +
						'<div class="gate-note">Если выбрано «Нет», показываются инициалы имени</div>' +
					'</div>' +

					'<div class="field">' +
						'<label>📝 О себе (био)</label>' +
						'<textarea id="bioInput" placeholder="Расскажите о себе..." maxlength="500" style="min-height:100px">' + escapeHtml(u.bio || "") + '</textarea>' +
						'<div class="char-count" id="bioCount">' + (u.bio || "").length + '/500</div>' +
					'</div>' +

					'<div class="actions">' +
						'<button class="btn btn-ghost" data-go="#/profile/' + session.id + '">Отмена</button>' +
						'<button class="btn btn-primary" id="saveProfileBtn">💾 Сохранить</button>' +
					'</div>' +
				'</div>' +
			'</div>'
		);

		bindGo();

		let pickedColor = u.color;
		let pickedEmoji = avEmoji;

		function updatePreview() {
			const pv = $("#avatarPreview");
			pv.style.background = pickedColor;
			pv.textContent = pickedEmoji || initials(u.name);
		}

		document.querySelectorAll(".color-swatch").forEach((sw) => {
			sw.onclick = () => {
				pickedColor = sw.dataset.color;
				document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"));
				sw.classList.add("active");
				updatePreview();
			};
		});

		document.querySelectorAll(".emoji-btn").forEach((eb) => {
			eb.onclick = () => {
				pickedEmoji = eb.dataset.emoji;
				document.querySelectorAll(".emoji-btn").forEach((e) => e.classList.remove("active"));
				eb.classList.add("active");
				updatePreview();
			};
		});

		const bioInput = $("#bioInput");
		bioInput.addEventListener("input", () => {
			$("#bioCount").textContent = bioInput.value.length + "/500";
		});

		$("#saveProfileBtn").onclick = () => {
			u.color = pickedColor;
			u.avatarEmoji = pickedEmoji;
			u.bio = bioInput.value.trim();
			saveData(data);

			session.color = pickedColor;
			session.avatarEmoji = pickedEmoji;
			setSession(session);

			const accKey = "rpmforum_acc_";
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith(accKey)) {
					const acc = JSON.parse(localStorage.getItem(key));
					if (acc.id === session.id) {
						acc.color = pickedColor;
						acc.avatarEmoji = pickedEmoji;
						acc.bio = u.bio;
						localStorage.setItem(key, JSON.stringify(acc));
						break;
					}
				}
			}

			renderUserActions();
			location.hash = "#/profile/" + session.id;
		};
	}

	function notFound() {
		return '<div class="empty-state"><div class="big">🚫</div>Страница не найдена.<br><a href="#/" style="color:var(--accent)">← На главную</a></div>';
	}

	function render(html) {
		app.innerHTML = html;
		window.scrollTo(0, 0);
	}
	function bindGo() {
		document.querySelectorAll("[data-go]").forEach((el) => { el.onclick = () => location.hash = el.dataset.go; });
	}

	function router() {
		data = loadData();
		ensureGoshaAdmin();

		/* Gate check */
		if (!isGatePassed()) return viewGate();

		const hash = location.hash.slice(1) || "/";
		const parts = hash.split("/").filter(Boolean);
		let route = parts[0] || "home";
		if (hash.startsWith("/search")) return viewSearch(decodeURIComponent(parts[1] || ""));
		if (hash === "/login") return viewAuth("login");
		if (hash === "/register") return viewAuth("register");
		if (hash === "/members") return viewMembers();
		if (hash === "/new") return viewNew();
		if (hash === "/rules") return viewRules();
		if (route === "forum" && parts[1]) return viewForum(parts[1]);
		if (route === "thread" && parts[1]) return viewThread(parts[1]);
		if (route === "new" && parts[1]) return viewNewThread(parts[1]);
		if (route === "newsub" && parts[1]) return viewNewSubforum(parts[1]);
		if (route === "profile" && parts[1]) return viewProfile(parts[1]);
		if (route === "settings") return viewSettings();
		if (route === "admin") return viewAdmin(parts[1]);
		return viewHome();
	}

	$("#searchInput").addEventListener("keydown", (e) => {
		if (e.key === "Enter" && e.target.value.trim()) location.hash = "/search/" + encodeURIComponent(e.target.value.trim());
	});
	window.addEventListener("hashchange", router);

	renderUserActions();
	router();
})();
