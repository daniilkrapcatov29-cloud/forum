(function () {
	"use strict";

	const AVATAR_COLORS = ["#6c8cff", "#00d4a8", "#ff6b9d", "#ffb84d", "#9b6cff", "#ff7849", "#3ecf8e"];
	const $ = (sel, root = document) => root.querySelector(sel);
	const app = $("#app");

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
				{ id: "pravitelstvo", icon: "🏛️", name: "Правительство", desc: "Официальный портал органов власти. Законодательная и исполнительная власть, министерства, аппарат Председателя Правительства. Назначения на госдолжности, подача законопроектов и госпрограмм.", threads: 1820, posts: 9430 },
				{ id: "fsb", icon: "🛡️", name: "ФСБ — Федеральная Служба Безопасности", desc: "Борьба с терроризмом, контрразведка, разведка, обеспечение государственной безопасности. Расследование тяжких преступлений против государства. Электронное заявление в Академию ФСБ, спецсвязь.", threads: 980, posts: 4120 },
				{ id: "gumvd", icon: "👮", name: "ГУ МВД — Главное Управление Внутренних Дел", desc: "Охрана правопорядка, борьба с уличной преступностью, патрулирование, оперативно-разыскная деятельность. УВД по округам, ГИБДД (ДПС), следственные отделы. Электронные заявления в полицию и ГИБДД.", threads: 3240, posts: 18600 },
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

	const STORE_KEY = "rpmforum_v2";
	const ADMIN_PASSWORD = "RPM-ADMIN-2024";
	const ADMIN_SESSION_KEY = "rpmforum_admin";
	const SESSION_KEY = "rpmforum_session";

	function loadData() {
		try {
			const raw = localStorage.getItem(STORE_KEY);
			if (raw) return JSON.parse(raw);
		} catch (e) {}
		saveData(DEFAULT_DATA);
		return JSON.parse(JSON.stringify(DEFAULT_DATA));
	}
	function saveData(data) {
		try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
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

	function getUser(id) { return data.users.find((u) => u.id === id); }
	function getForum(id) { return data.categories.flatMap((c) => c.forums).find((f) => f.id === id); }
	function getThread(id) { return data.threads.find((t) => t.id === Number(id)); }
	function forumThreads(fid) { return data.threads.filter((t) => t.forumId === fid); }

	function renderUserActions() {
		const el = $("#userActions");
		if (session) {
			el.innerHTML = `
				<div class="avatar" style="background:${session.color}">${initials(session.name)}</div>
				<button class="btn btn-ghost" id="logoutBtn">Выйти</button>`;
			$("#logoutBtn").onclick = () => { setSession(null); session = null; renderUserActions(); router(); };
		} else {
			el.innerHTML = `<button class="btn btn-ghost" data-route="#/login">Вход</button><button class="btn btn-primary" data-route="#/register">Регистрация</button>`;
			el.querySelectorAll("[data-route]").forEach((b) => b.onclick = () => location.hash = b.dataset.route);
		}
	}

	function viewHome() {
		const totalThreads = data.threads.length;
		const totalPosts = data.threads.reduce((s, t) => s + t.posts.length, 0);
		const stats = `
			<section class="stats-banner">
				<div class="stat-card"><div class="label">Тем</div><div class="value">${fmt(totalThreads)}</div></div>
				<div class="stat-card"><div class="label">Сообщений</div><div class="value">${fmt(totalPosts)}</div></div>
				<div class="stat-card"><div class="label">Участников</div><div class="value">${fmt(data.users.length)}</div></div>
				<div class="stat-card"><div class="label">Новый</div><div class="value" style="font-size:14px">${data.users[data.users.length-1].name}</div></div>
			</section>`;

		const cats = data.categories.map((cat) => `
			<section class="category">
				<div class="category-head"><h2>${escapeHtml(cat.title)}</h2></div>
				${cat.forums.map((f) => {
					const last = forumThreads(f.id).sort((a, b) => b.created - a.created)[0];
					return `
					<div class="forum-row" data-go="#/forum/${f.id}">
						<div class="forum-icon">${f.icon}</div>
						<div class="forum-meta">
							<h3>${escapeHtml(f.name)}</h3>
							<p>${escapeHtml(f.desc)}</p>
							${last ? `<div class="forum-lastpost">Последняя: ${escapeHtml(last.title)}</div>` : ""}
						</div>
						<div class="forum-stats">
							<strong>${fmt(f.threads)}</strong> тем
							<strong>${fmt(f.posts)}</strong> сообщений
						</div>
					</div>`;
				}).join("")}
			</section>`).join("");

		render(`${stats}${cats}`);
		bindGo();
	}

	function viewForum(fid) {
		const forum = getForum(fid);
		if (!forum) return render(notFound());
		const threads = forumThreads(fid).sort((a, b) => (b.pinned - a.pinned) || (b.created - a.created));

		const rows = threads.length ? threads.map((t) => {
			const u = getUser(t.author);
			const last = t.posts[t.posts.length - 1];
			return `
			<div class="thread-row" data-go="#/thread/${t.id}">
				<div class="avatar" style="background:${u ? u.color : "#888"}">${u ? initials(u.name) : "?"}</div>
				<div class="thread-info">
					<h3>${t.pinned ? '<span class="tag tag-pinned">Закреп</span>' : ""}${t.closed ? '<span class="tag tag-closed">Закрыта</span>' : ""}<a href="#/thread/${t.id}">${escapeHtml(t.title)}</a></h3>
					<div class="thread-meta">Автор: ${u ? escapeHtml(u.name) : "?"} · ${timeAgo(t.created)} · ${fmt(t.views)} просмотров</div>
				</div>
				<div class="thread-stats"><strong>${t.posts.length}</strong> ответов<br>${last ? timeAgo(last.created) : ""}</div>
			</div>`;
		}).join("") : `<div class="empty-state"><div class="big">📭</div>В этом разделе пока нет тем.<br>${session ? "Создай первую!" : "Войди, чтобы создать тему."}</div>`;

		const newBtn = session ? `<button class="btn btn-primary" data-go="#/new/${fid}">＋ Новая тема</button>` : "";
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>${escapeHtml(forum.name)}</span></div>
			<div class="page-head">
				<div class="page-title"><h1>${forum.icon} ${escapeHtml(forum.name)}</h1></div>
				${newBtn}
			</div>
			<div class="thread-list">${rows}</div>
		`);
		bindGo();
	}

	function viewThread(tid) {
		const t = getThread(tid);
		if (!t) return render(notFound());
		const forum = getForum(t.forumId);
		t.views++;
		saveData(data);

		const posts = t.posts.map((p) => {
			const u = getUser(p.author) || { name: "Удалён", role: "—", color: "#888", posts: 0, joined: 0 };
			return `
			<article class="post">
				<aside class="post-aside">
					<div class="avatar" style="background:${u.color}">${initials(u.name)}</div>
					<div class="post-author">${escapeHtml(u.name)}</div>
					<div class="post-role">${escapeHtml(u.role)}</div>
					<div class="post-stats">Сообщений: ${fmt(u.posts)}<br>С нами с: ${new Date(u.joined).toLocaleDateString("ru-RU")}</div>
				</aside>
				<div class="post-body">
					<div class="post-date">${timeAgo(p.created)}</div>
					<div class="post-content">${escapeHtml(p.content).replace(/\n/g, "<br>")}</div>
					<div class="post-actions"><button>👍 Нравится</button><button>💬 Цитировать</button><button>⚠ Жалоба</button></div>
				</div>
			</article>`;
		}).join("");

		const reply = session && !t.closed ? `
			<div class="reply-box">
				<h3>Ваш ответ</h3>
				<textarea id="replyText" placeholder="Напишите ответ..."></textarea>
				<div class="actions"><button class="btn btn-primary" id="postReply">Отправить</button></div>
			</div>` : (!session ? `<div class="empty-state">Войдите, чтобы ответить в теме.</div>` : `<div class="empty-state">🔒 Тема закрыта для ответов.</div>`);

		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><a href="#/forum/${t.forumId}">${escapeHtml(forum.name)}</a><span>›</span><span>${escapeHtml(t.title)}</span></div>
			<div class="page-head">
				<div class="page-title"><h1>${escapeHtml(t.title)}</h1></div>
			</div>
			${posts}
			${reply}
		`);
		if (session && !t.closed) {
			$("#postReply").onclick = () => {
				const text = $("#replyText").value.trim();
				if (!text) return;
				t.posts.push({ author: session.id, created: Date.now(), content: text });
				saveData(data);
				router();
			};
		}
	}

	function viewNewThread(fid) {
		if (!session) { location.hash = "#/login"; return; }
		const forum = getForum(fid);
		if (!forum) return render(notFound());
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><a href="#/forum/${fid}">${escapeHtml(forum.name)}</a><span>›</span><span>Новая тема</span></div>
			<div class="page-head"><div class="page-title"><h1>Новая тема</h1></div></div>
			<div class="reply-box new-thread">
				<div class="field"><label>Заголовок</label><input type="text" id="threadTitle" placeholder="Краткое название темы"></div>
				<div class="field"><label>Сообщение</label>
					<div class="editor-tools">
						<button data-tag="**" title="Жирный">B</button>
						<button data-tag="*" title="Курсив">I</button>
						<button data-tag="__" title="Подчёркнутый">U</button>
						<button data-tag="\n> " title="Цитата">"</button>
					</div>
					<textarea id="threadBody" placeholder="Текст темы..."></textarea>
				</div>
				<div class="actions"><button class="btn btn-ghost" data-go="#/forum/${fid}">Отмена</button><button class="btn btn-primary" id="submitThread">Создать тему</button></div>
			</div>
		`);
		bindGo();
		$("#submitThread").onclick = () => {
			const title = $("#threadTitle").value.trim();
			const body = $("#threadBody").value.trim();
			if (!title || !body) return alert("Заполните заголовок и сообщение");
			const newId = Date.now();
			data.threads.unshift({ id: newId, forumId: fid, title, author: session.id, created: Date.now(), posts: [{ author: session.id, created: Date.now(), content: body }], pinned: false, closed: false, views: 0 });
			saveData(data);
			location.hash = `#/thread/${newId}`;
		};
		document.querySelectorAll(".editor-tools button").forEach((b) => {
			b.onclick = () => {
				const ta = $("#threadBody");
				const tag = b.dataset.tag;
				ta.value += tag.replace(/\\n/g, "\n");
				ta.focus();
			};
		});
	}

	function viewAuth(mode) {
		const isLogin = mode === "login";
		render(`
			<div class="auth-card">
				<h2>${isLogin ? "Вход на форум" : "Регистрация"}</h2>
				<div class="sub">${isLogin ? "Войдите, чтобы участвовать в обсуждениях" : "Создайте аккаунт за минуту"}</div>
				${!isLogin ? `<div class="field"><label>Имя пользователя</label><input type="text" id="authName"></div>` : ""}
				<div class="field"><label>Логин</label><input type="text" id="authLogin" placeholder="${isLogin ? "Ваш логин" : "Придумайте логин"}"></div>
				<div class="field"><label>Пароль</label><input type="password" id="authPass" placeholder="Пароль"></div>
				<button class="btn btn-primary" id="authSubmit">${isLogin ? "Войти" : "Зарегистрироваться"}</button>
				<div class="auth-switch">${isLogin ? 'Нет аккаунта? <a href="#/register">Регистрация</a>' : 'Уже есть аккаунт? <a href="#/login">Войти</a>'}</div>
			</div>
		`);
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
				session = { id: acc.id, name: acc.name, role: "Игрок", color: acc.color };
				setSession(session);
			} else {
				const name = $("#authName").value.trim() || login;
				if (localStorage.getItem("rpmforum_acc_" + login)) return alert("Логин занят");
				const id = Date.now();
				const color = avatarColor(name);
				const acc = { id, name, login, pass, color };
				localStorage.setItem("rpmforum_acc_" + login, JSON.stringify(acc));
				data.users.push({ id, name, role: "Игрок", color, joined: Date.now(), posts: 0 });
				saveData(data);
				session = { id, name, role: "Игрок", color };
				setSession(session);
			}
			renderUserActions();
			location.hash = "#/";
		};
	}

	function viewMembers() {
		const sorted = [...data.users].sort((a, b) => b.posts - a.posts);
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Участники</span></div>
			<div class="page-head"><div class="page-title"><h1>Участники сообщества</h1></div></div>
			<div class="thread-list">
				${sorted.map((u) => `
					<div class="thread-row">
						<div class="avatar" style="background:${u.color};width:48px;height:48px">${initials(u.name)}</div>
						<div class="thread-info"><h3>${escapeHtml(u.name)}</h3><div class="thread-meta">${escapeHtml(u.role)} · С нами с ${new Date(u.joined).toLocaleDateString("ru-RU")}</div></div>
						<div class="thread-stats"><strong>${fmt(u.posts)}</strong> сообщений</div>
					</div>`).join("")}
			</div>
		`);
	}

	function viewNew() {
		const recent = [...data.threads].sort((a, b) => b.created - a.created).slice(0, 20);
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Новые сообщения</span></div>
			<div class="page-head"><div class="page-title"><h1>Новые сообщения</h1></div></div>
			<div class="thread-list">
				${recent.map((t) => {
					const u = getUser(t.author);
					const f = getForum(t.forumId);
					return `
					<div class="thread-row" data-go="#/thread/${t.id}">
						<div class="avatar" style="background:${u ? u.color : "#888"}">${u ? initials(u.name) : "?"}</div>
						<div class="thread-info">
							<h3><a href="#/thread/${t.id}">${escapeHtml(t.title)}</a></h3>
							<div class="thread-meta">${escapeHtml(f ? f.name : "")} · ${u ? escapeHtml(u.name) : "?"} · ${timeAgo(t.created)}</div>
						</div>
						<div class="thread-stats"><strong>${t.posts.length}</strong> ответов</div>
					</div>`;
				}).join("")}
			</div>
		`);
		bindGo();
	}

	function viewRules() {
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Правила</span></div>
			<div class="reply-box">
				<h2>Правила форума</h2><br>
				<div class="post-content">
					<p><strong>1. Уважение.</strong> Оскорбления, дискриминация и травля запрещены.</p>
					<p><strong>2. Язык.</strong> Общение на русском языке. Без мата и нецензурной лексики.</p>
					<p><strong>3. Разделы.</strong> Создавайте темы в соответствующих разделах.</p>
					<p><strong>4. Реклама.</strong> Реклама сторонних проектов без согласования запрещена.</p>
					<p><strong>5. Флуд.</strong> Не создавайте дубли тем и не флудите оффтопом.</p>
					<p><strong>6. Контент.</strong> Запрещён NSFW-контент, призывы к нарушению закона.</p>
					<p>Нарушение правил ведёт к предупреждению, муту или бану.</p>
				</div>
			</div>
		`);
	}

	function viewSearch(q) {
		const ql = q.toLowerCase();
		const found = data.threads.filter((t) => t.title.toLowerCase().includes(ql) || t.posts.some((p) => p.content.toLowerCase().includes(ql)));
		render(`
			<div class="breadcrumb"><a href="#/">Главная</a><span>›</span><span>Поиск</span></div>
			<div class="page-head"><div class="page-title"><h1>Результаты: "${escapeHtml(q)}"</h1></div></div>
			<div class="thread-list">
				${found.length ? found.map((t) => {
					const u = getUser(t.author);
					return `<div class="thread-row" data-go="#/thread/${t.id}">
						<div class="avatar" style="background:${u ? u.color : "#888"}">${u ? initials(u.name) : "?"}</div>
						<div class="thread-info"><h3><a href="#/thread/${t.id}">${escapeHtml(t.title)}</a></h3><div class="thread-meta">${timeAgo(t.created)}</div></div>
						<div class="thread-stats"><strong>${t.posts.length}</strong> ответов</div>
					</div>`;
				}).join("") : `<div class="empty-state"><div class="big">🔍</div>Ничего не найдено.</div>`}
			</div>
		`);
		bindGo();
	}

	function viewAdmin(section) {
		section = section || "dashboard";
		const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
		if (!isAdmin) return viewAdminLogin();

		const adminNav = `
			<nav class="admin-nav">
				<a href="#/admin" class="${section === "dashboard" ? "active" : ""}">📊 Дашборд</a>
				<a href="#/admin/forums" class="${section === "forums" ? "active" : ""}">📂 Разделы</a>
				<a href="#/admin/threads" class="${section === "threads" ? "active" : ""}">💬 Темы</a>
				<a href="#/admin/users" class="${section === "users" ? "active" : ""}">👥 Пользователи</a>
				<a href="#/" style="margin-left:auto;color:var(--text-mute)">← На форум</a>
			</nav>`;

		let content = "";
		if (section === "dashboard") content = adminDashboard();
		else if (section === "forums") content = adminForums();
		else if (section === "threads") content = adminThreads();
		else if (section === "users") content = adminUsers();

		render(`
			<div class="admin-wrap">
				<div class="admin-header"><h1>⚡ Админ-панель</h1><button class="btn btn-danger" id="adminLogout">Выйти из админки</button></div>
				${adminNav}
				<div class="admin-body">${content}</div>
			</div>
		`);
		$("#adminLogout").onclick = () => { sessionStorage.removeItem(ADMIN_SESSION_KEY); location.hash = "#/"; };
		bindAdminActions();
	}

	function viewAdminLogin() {
		render(`
			<div class="auth-card">
				<h2>🔒 Вход в админ-панель</h2>
				<div class="sub">Введите мастер-пароль администратора</div>
				<div class="field"><label>Мастер-пароль</label><input type="password" id="adminPass" placeholder="Пароль"></div>
				<button class="btn btn-primary" id="adminLoginBtn">Войти</button>
				<div class="auth-switch"><a href="#/">← На главную</a></div>
			</div>
		`);
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
		return `
			<div class="stats-banner">
				<div class="stat-card"><div class="label">Категорий</div><div class="value">${data.categories.length}</div></div>
				<div class="stat-card"><div class="label">Разделов</div><div class="value">${totalForums}</div></div>
				<div class="stat-card"><div class="label">Тем</div><div class="value">${fmt(totalThreads)}</div></div>
				<div class="stat-card"><div class="label">Пользователей</div><div class="value">${fmt(data.users.length)}</div></div>
			</div>
			<div class="admin-card">
				<h3>Быстрые действия</h3>
				<div class="admin-quick">
					<a href="#/admin/forums" class="quick-btn">📂 Управление разделами</a>
					<a href="#/admin/threads" class="quick-btn">💬 Управление темами</a>
					<a href="#/admin/users" class="quick-btn">👥 Управление пользователями</a>
				</div>
			</div>`;
	}

	function adminForums() {
		const catList = data.categories.map((cat) => `
			<div class="admin-card">
				<h3>${escapeHtml(cat.title)} <span class="muted">(${cat.forums.length})</span></h3>
				<div class="admin-table">
					${cat.forums.map((f) => `
						<div class="admin-row">
							<span class="forum-icon-sm">${f.icon}</span>
							<div><strong>${escapeHtml(f.name)}</strong><br><span class="muted">${escapeHtml(f.desc)}</span></div>
							<div class="muted">${fmt(f.threads)} тем / ${fmt(f.posts)} сообщ.</div>
							<button class="btn btn-danger btn-sm" data-del-forum="${cat.id}|${f.id}">Удалить</button>
						</div>`).join("")}
				</div>
			</div>`).join("");

		return `
			<div class="admin-card">
				<h3>➕ Добавить раздел</h3>
				<div class="admin-form">
					<select id="newForumCat">
						${data.categories.map((c) => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join("")}
					</select>
					<input type="text" id="newForumIcon" placeholder="Иконка (эмодзи)" maxlength="4" value="📋">
					<input type="text" id="newForumName" placeholder="Название раздела">
					<input type="text" id="newForumDesc" placeholder="Описание">
					<button class="btn btn-primary" id="addForumBtn">Добавить</button>
				</div>
			</div>
			${catList}`;
	}

	function adminThreads() {
		const rows = [...data.threads].sort((a, b) => b.created - a.created).map((t) => {
			const u = getUser(t.author);
			const f = getForum(t.forumId);
			return `
				<div class="admin-row">
					<div><strong>${escapeHtml(t.title)}</strong><br><span class="muted">${escapeHtml(f ? f.name : "?")} · ${u ? escapeHtml(u.name) : "?"}</span></div>
					<div class="muted">${t.posts.length} ответов · ${fmt(t.views)} просм.</div>
					<div class="admin-row-btns">
						<button class="btn btn-ghost btn-sm" data-pin-thread="${t.id}">${t.pinned ? "Открепить" : "Закрепить"}</button>
						<button class="btn btn-ghost btn-sm" data-close-thread="${t.id}">${t.closed ? "Открыть" : "Закрыть"}</button>
						<button class="btn btn-danger btn-sm" data-del-thread="${t.id}">Удалить</button>
					</div>
				</div>`;
		}).join("");
		return `<div class="admin-card"><h3>Все темы (${data.threads.length})</h3><div class="admin-table">${rows}</div></div>`;
	}

	function adminUsers() {
		const rows = [...data.users].sort((a, b) => a.id - b.id).map((u) => `
			<div class="admin-row">
				<div class="avatar" style="background:${u.color};width:40px;height:40px">${initials(u.name)}</div>
				<div><strong>${escapeHtml(u.name)}</strong><br><span class="muted">${fmt(u.posts)} сообщений · ID ${u.id}</span></div>
				<select class="role-select" data-role-user="${u.id}">
					<option value="Игрок" ${u.role === "Игрок" ? "selected" : ""}>Игрок</option>
					<option value="Модератор" ${u.role === "Модератор" ? "selected" : ""}>Модератор</option>
					<option value="Администратор" ${u.role === "Администратор" ? "selected" : ""}>Администратор</option>
				</select>
			</div>`).join("");
		return `<div class="admin-card"><h3>Пользователи (${data.users.length})</h3><div class="admin-table">${rows}</div></div>`;
	}

	function bindAdminActions() {
		document.querySelectorAll("[data-del-forum]").forEach((b) => {
			b.onclick = () => {
				const [catId, fid] = b.dataset.delForum.split("|");
				if (!confirm("Удалить раздел? Все темы в нём также будут удалены.")) return;
				const cat = data.categories.find((c) => c.id === catId);
				if (cat) cat.forums = cat.forums.filter((f) => f.id !== fid);
				data.threads = data.threads.filter((t) => t.forumId !== fid);
				saveData(data);
				viewAdmin("forums");
			};
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
				saveData(data);
				viewAdmin("forums");
			};
		}
		document.querySelectorAll("[data-del-thread]").forEach((b) => {
			b.onclick = () => {
				if (!confirm("Удалить тему?")) return;
				data.threads = data.threads.filter((t) => t.id !== Number(b.dataset.delThread));
				saveData(data);
				viewAdmin("threads");
			};
		});
		document.querySelectorAll("[data-pin-thread]").forEach((b) => {
			b.onclick = () => {
				const t = getThread(b.dataset.pinThread);
				if (t) { t.pinned = !t.pinned; saveData(data); viewAdmin("threads"); }
			};
		});
		document.querySelectorAll("[data-close-thread]").forEach((b) => {
			b.onclick = () => {
				const t = getThread(b.dataset.closeThread);
				if (t) { t.closed = !t.closed; saveData(data); viewAdmin("threads"); }
			};
		});
		document.querySelectorAll("[data-role-user]").forEach((sel) => {
			sel.onchange = () => {
				const u = getUser(Number(sel.dataset.roleUser));
				if (u) { u.role = sel.value; saveData(data); }
			};
		});
	}

	function notFound() {
		return `<div class="empty-state"><div class="big">🚫</div>Страница не найдена.<br><a href="#/" style="color:var(--accent)">← На главную</a></div>`;
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
		if (route === "admin") return viewAdmin(parts[1]);
		return viewHome();
	}

	$("#searchInput").addEventListener("keydown", (e) => {
		if (e.key === "Enter" && e.target.value.trim()) location.hash = `/search/${encodeURIComponent(e.target.value.trim())}`;
	});
	window.addEventListener("hashchange", router);

	renderUserActions();
	router();
})();
    function renderRole(role) {
        if (role === "РУКОВОДСТВО ПРОЕКТА") {
            return `<div class="post-role"><span class="rank-badge rank-leadership">${escapeHtml(role)}</span></div>`;
        }
        if (role === "Администратор") {
            return `<div class="post-role"><span class="rank-badge rank-admin">${escapeHtml(role)}</span></div>`;
        }
        if (role === "Модератор") {
            return `<div class="post-role"><span class="rank-badge rank-mod">${escapeHtml(role)}</span></div>`;
        }
        return `<div class="post-role">${escapeHtml(role)}</div>`;
    }