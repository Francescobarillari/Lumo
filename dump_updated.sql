BEGIN;

-- PULIZIA (opzionale, distruttiva)
TRUNCATE TABLE "event", users RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY;

-- =========================================================
-- UTENTI realistici (fittizi) + email realistiche
-- =========================================================

-- Account demo (credenziali sotto)
INSERT INTO users (name, email, password_hash, birthdate, description, is_admin)
VALUES (
  'Giulia Rinaldi',
  'demo@lumo.test',
  '$2y$10$ebHQc53xaVwfrjbkq.zIWO4VrM/FkBLU7ZLk6cRa3fBAlgBAaqUVq', -- LumoTest123!
  '1992-06-15',
  'Account demo per test',
  false
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    birthdate = EXCLUDED.birthdate,
    description = EXCLUDED.description,
    is_admin = EXCLUDED.is_admin;

-- Account admin (credenziali sotto)
INSERT INTO users (name, email, password_hash, birthdate, description, is_admin)
VALUES (
  'Marco Bianchi',
  'admin@lumo.test',
  '$2y$10$ebHQc53xaVwfrjbkq.zIWO4VrM/FkBLU7ZLk6cRa3fBAlgBAaqUVq', -- LumoTest123!
  '1988-01-10',
  'Account amministratore',
  true
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    birthdate = EXCLUDED.birthdate,
    description = EXCLUDED.description,
    is_admin = EXCLUDED.is_admin;

-- Altri 198 utenti (totale 200 con demo+admin)
WITH name_pool AS (
  SELECT
    ARRAY[
      'Marco','Luca','Matteo','Andrea','Giovanni','Davide','Simone','Alessandro','Federico','Gabriele',
      'Riccardo','Nicola','Stefano','Francesco','Emanuele','Pietro','Alberto','Michele','Tommaso','Enrico',
      'Giulia','Francesca','Martina','Sara','Chiara','Elisa','Valentina','Alice','Federica','Ilaria',
      'Sofia','Aurora','Beatrice','Greta','Laura','Elena','Silvia','Paola','Claudia','Veronica'
    ] AS first_names,
    ARRAY[
      'Rossi','Bianchi','Russo','Ferrari','Esposito','Romano','Colombo','Ricci','Marino','Greco',
      'Bruno','Gallo','Conti','De Luca','Costa','Giordano','Mancini','Rinaldi','Lombardi','Barbieri',
      'Fontana','Moretti','Caruso','Santoro','Mariani','Fabbri','Sala','Longo','Serra','Monti'
    ] AS last_names,
    ARRAY[
      'Amo i concerti e i weekend fuori porta.',
      'Sempre in cerca di eventi e nuove persone.',
      'Runner amatoriale, foodie convinto.',
      'Mi piacciono fotografia, mostre e aperitivi.',
      'Tech e community: ci vediamo ai meetup.',
      'Yoga e natura: se c’è una camminata, ci sono.',
      'Musica live e street food: combo perfetta.',
      'Fan dei cineforum e delle serate quiz.'
    ] AS bios
),
u_gen AS (
  SELECT
    g,
    -- seed deterministico da md5 (così nomi/email non cambiano ad ogni run)
    abs((('x' || substr(md5(g::text), 1, 8))::bit(32)::int)) AS s1,
    abs((('x' || substr(md5((g::text || 'x')), 1, 8))::bit(32)::int)) AS s2,
    abs((('x' || substr(md5((g::text || 'bio')), 1, 8))::bit(32)::int)) AS s3
  FROM generate_series(1,198) g
)
INSERT INTO users (name, email, password_hash, birthdate, description, is_admin)
SELECT
  (np.first_names[1 + (ug.s1 % array_length(np.first_names,1))] || ' ' ||
   np.last_names[1 + (ug.s2 % array_length(np.last_names,1))]) AS name,
  lower(
    translate(
      replace(
        (np.first_names[1 + (ug.s1 % array_length(np.first_names,1))] || '.' ||
         np.last_names[1 + (ug.s2 % array_length(np.last_names,1))]),
        ' ', ''
      ),
      '''',
      ''
    )
  ) || ug.g || '@lumo.test' AS email,
  '$2y$10$ebHQc53xaVwfrjbkq.zIWO4VrM/FkBLU7ZLk6cRa3fBAlgBAaqUVq' AS password_hash,
  (date '1985-01-01' + (random()*12000)::int) AS birthdate,
  np.bios[1 + (ug.s3 % array_length(np.bios,1))] AS description,
  false AS is_admin
FROM u_gen ug
CROSS JOIN name_pool np
ON CONFLICT (email) DO NOTHING;

-- =========================================================
-- EVENTI realistici (titolo + descrizione) su città italiane
-- =========================================================
WITH cities(city, lat, lon) AS (
  VALUES
    ('Milano',45.4642,9.1900),
    ('Torino',45.0703,7.6869),
    ('Genova',44.4056,8.9463),
    ('Venezia',45.4408,12.3155),
    ('Verona',45.4384,10.9916),
    ('Bologna',44.4949,11.3426),
    ('Firenze',43.7696,11.2558),
    ('Pisa',43.7228,10.4017),
    ('Roma',41.9028,12.4964),
    ('Napoli',40.8518,14.2681),
    ('Bari',41.1171,16.8719),
    ('Lecce',40.3515,18.1750),
    ('Palermo',38.1157,13.3615),
    ('Catania',37.5079,15.0830),
    ('Cagliari',39.2238,9.1217),
    ('Trieste',45.6495,13.7768),
    ('Trento',46.0664,11.1258),
    ('Perugia',43.1107,12.3908),
    ('Ancona',43.6158,13.5189),
    ('L''Aquila',42.3507,13.3995),
    ('Reggio Calabria',38.1147,15.6500),
    ('Messina',38.1938,15.5540),
    ('Sassari',40.7259,8.5557),
    ('Pescara',42.4618,14.2161),
    ('Salerno',40.6824,14.7681)
),
city_list AS (
  SELECT row_number() OVER (ORDER BY random()) AS rn, city, lat, lon FROM cities
),
cnt AS (SELECT count(*) AS cnt FROM city_list),
event_templates AS (
  SELECT
    ARRAY[
      'Aperitivo & Networking a %s',
      'Passeggiata fotografica in centro a %s',
      'Street Food Tour serale a %s',
      'Live Music Night: indie & rock a %s',
      'Cineforum (se il meteo regge) a %s',
      'Degustazione vini e prodotti locali a %s',
      'Giro in bici al tramonto a %s',
      'Book Club: incontro e discussione a %s',
      'Hike easy: natura e chiacchiere vicino %s',
      'Yoga al mattino + colazione a %s',
      'Quiz Night al pub: squadre e premi a %s',
      'Mercatini & artigianato: tour di %s'
    ] AS titles,
    ARRAY[
      'Ci troviamo in zona centrale, facciamo conoscenza e poi ci spostiamo insieme. Ambiente informale, perfetto per socializzare.',
      'Percorso semplice, ideale anche per principianti. Porta una fotocamera o solo lo smartphone: contano le storie, non l’attrezzatura.',
      'Tappe in 3-4 posti selezionati, porzioni condivise e finale con dolce. Segnala allergie o preferenze in chat.',
      'Serata con musica live e atmosfera rilassata. Dopo il set, chi vuole resta per due chiacchiere.',
      'Proiezione + discussione finale. Porta una felpa: la sera rinfresca. In caso di pioggia ci spostiamo indoor.',
      'Degustazione guidata (2-3 calici) e assaggi. Posti limitati per stare comodi.',
      'Giro tranquillo, ritmo “da chiacchiere”. Casco consigliato. Se non hai la bici scrivilo in chat.',
      'Scegliamo un libro del mese e ci confrontiamo senza ansia. Anche se non l’hai finito, vieni lo stesso!',
      'Camminata leggera con pausa panorama. Scarpe comode, acqua e voglia di parlare con sconosciuti simpatici.',
      'Sessione adatta a tutti + colazione insieme. Porta tappetino (se non lo hai, scrivilo).',
      'Formiamo squadre sul posto. Premi simbolici e tante risate. Arriva 10 minuti prima per registrarti.',
      'Giro tra bancarelle e botteghe, con pausa caffè. Ottimo per conoscere la città e fare due chiacchiere.'
    ] AS descriptions
),
event_meta AS (
  SELECT
    g,
    c.city,
    c.lat,
    c.lon,
    abs((('x' || substr(md5(('t' || g)::text), 1, 8))::bit(32)::int)) AS st,
    abs((('x' || substr(md5(('d' || g)::text), 1, 8))::bit(32)::int)) AS sd
  FROM generate_series(1,100) g
  JOIN city_list c ON c.rn = ((g - 1) % (SELECT cnt FROM cnt)) + 1
),
ordered_users AS (
  SELECT id, row_number() OVER (ORDER BY id) AS rn FROM users
),
total_users AS (
  SELECT count(*)::int AS cnt FROM ordered_users
)
INSERT INTO "event" (
  title, description, n_partecipants, city, date, start_time, end_time, created_at,
  latitude, longitude, cost_per_person, is_approved, creator_id
)
SELECT
  format(et.titles[1 + (em.st % array_length(et.titles,1))], em.city) AS title,
  et.descriptions[1 + (em.sd % array_length(et.descriptions,1))] AS description,
  (10 + floor(random()*140)::int) AS n_partecipants,
  em.city,
  -- date tra 16 e 25 gennaio (inclusi)
  (date '2026-01-16' + ((em.g - 1) % 10))::date AS date,
  t.start_time,
  (t.start_time + interval '2 hours')::time AS end_time,
  now() - (random()*30)::int * interval '1 day' AS created_at,
  em.lat + (random() - 0.5) * 0.6 AS latitude,
  em.lon + (random() - 0.5) * 0.6 AS longitude,
  CASE WHEN random() < 0.2 THEN 0 ELSE round((5 + random()*40)::numeric, 2) END AS cost_per_person,
  CASE WHEN random() < 0.25 THEN false ELSE true END AS is_approved, -- ~25% pending
  creator.id AS creator_id
FROM event_meta em
CROSS JOIN event_templates et
-- distribuisce gli eventi tra più creatori (deterministico, non "tutti lo stesso")
JOIN ordered_users creator
  ON creator.rn = ((em.g - 1) % (SELECT cnt FROM total_users)) + 1
JOIN LATERAL (
  SELECT (time '17:00' + (floor(random()*5)::int) * interval '1 hour')::time AS start_time
) t ON true;


-- Chat per evento
INSERT INTO event_chat (event_id, created_at)
SELECT id, now() - (random()*10)::int * interval '1 day'
FROM "event";

-- Follows (5 per utente)
WITH ordered_users AS (
  SELECT id, row_number() OVER (ORDER BY id) AS rn FROM users
),
total AS (SELECT count(*)::int AS cnt FROM ordered_users)
INSERT INTO user_follows (follower_id, followed_id)
SELECT u.id, u2.id
FROM ordered_users u
CROSS JOIN total
CROSS JOIN generate_series(1,5) off
JOIN ordered_users u2 ON u2.rn = ((u.rn + off - 1) % total.cnt) + 1
WHERE u2.id <> u.id
  AND NOT EXISTS (
    SELECT 1 FROM user_follows uf
    WHERE uf.follower_id = u.id AND uf.followed_id = u2.id
  );

-- Abilita notifiche per una parte dei follow
INSERT INTO user_follow_notifications (follower_id, followed_id)
SELECT uf.follower_id, uf.followed_id
FROM user_follows uf
WHERE random() < 0.2
  AND NOT EXISTS (
    SELECT 1 FROM user_follow_notifications ufn
    WHERE ufn.follower_id = uf.follower_id AND ufn.followed_id = uf.followed_id
  );

-- Partecipazioni agli eventi
INSERT INTO user_participations (user_id, event_id)
SELECT u.id, e.id
FROM "event" e
JOIN LATERAL (
  SELECT id FROM users ORDER BY random()
  LIMIT GREATEST(10, LEAST(e.n_partecipants, 20 + floor(random()*20)::int))
) u ON true
WHERE NOT EXISTS (
  SELECT 1 FROM user_participations up
  WHERE up.user_id = u.id AND up.event_id = e.id
);

-- Demo user partecipa a 8 eventi
INSERT INTO user_participations (user_id, event_id)
SELECT demo.id, e.id
FROM (SELECT id FROM users WHERE email = 'demo@lumo.test' LIMIT 1) demo
JOIN (SELECT id FROM "event" ORDER BY id LIMIT 8) e ON true
WHERE NOT EXISTS (
  SELECT 1 FROM user_participations up
  WHERE up.user_id = demo.id AND up.event_id = e.id
);

-- Partecipazioni pendenti
INSERT INTO user_pending_participations (user_id, event_id)
SELECT u.id, e.id
FROM "event" e
JOIN LATERAL (
  SELECT id FROM users u
  WHERE NOT EXISTS (
    SELECT 1 FROM user_participations up
    WHERE up.user_id = u.id AND up.event_id = e.id
  )
  ORDER BY random()
  LIMIT 5
) u ON true
WHERE NOT EXISTS (
  SELECT 1 FROM user_pending_participations upp
  WHERE upp.user_id = u.id AND upp.event_id = e.id
);

-- Rimuove i creator dalle partecipazioni (coerente con il nuovo backend)
DELETE FROM user_participations up
USING "event" e
WHERE up.event_id = e.id
  AND up.user_id = e.creator_id;

-- Rimuove i creator dalle pending (se presenti)
DELETE FROM user_pending_participations upp
USING "event" e
WHERE upp.event_id = e.id
  AND upp.user_id = e.creator_id;

-- Eventi salvati (3 per utente)
INSERT INTO user_saved (user_id, event_id)
SELECT u.id, e.id
FROM users u
JOIN LATERAL (SELECT id FROM "event" ORDER BY random() LIMIT 3) e ON true
WHERE NOT EXISTS (
  SELECT 1 FROM user_saved us
  WHERE us.user_id = u.id AND us.event_id = e.id
);

-- Messaggi chat
WITH msg_pool AS (
  SELECT ARRAY[
    'Ciao a tutti! 👋',
    'Io ci sono, ci vediamo lì!',
    'Qualcuno viene in auto? Ho posti.',
    'Porto un amico/a, va bene?',
    'A che ora ci troviamo esattamente?',
    'Non vedo l''ora! 🙌',
    'Ho salvato l''evento, grazie per l''organizzazione!',
    'Ci sono ancora posti disponibili?',
    'Che musica/format è previsto?',
    'Io arrivo un po'' in ritardo, vi raggiungo.'
  ] AS msgs
)
INSERT INTO chat_message (chat_id, sender_id, content, created_at)
SELECT c.id,
       p.user_id,
       msg_pool.msgs[1 + floor(random()*array_length(msg_pool.msgs,1))::int],
       now() - (random()*5)::int * interval '1 day' - (random()*6)::int * interval '1 hour'
FROM event_chat c
JOIN LATERAL (
  SELECT user_id FROM user_participations
  WHERE event_id = c.event_id
  ORDER BY random()
  LIMIT 10
) p ON true
JOIN LATERAL generate_series(1,2) g ON true
CROSS JOIN msg_pool;

-- Messaggi demo user
INSERT INTO chat_message (chat_id, sender_id, content, created_at)
SELECT c.id, demo.id, 'Ciao! Sono l''account demo 🙂 Ci vediamo all''evento!', now() - interval '30 minutes'
FROM event_chat c
JOIN (SELECT id FROM users WHERE email = 'demo@lumo.test' LIMIT 1) demo ON true
ORDER BY c.id
LIMIT 10;

-- REPORT (ADMIN)
-- Totali principali
SELECT
  (SELECT count(*) FROM users) AS total_users,
  (SELECT count(*) FROM "event") AS total_events,
  (SELECT count(*) FROM "event" WHERE is_approved = false) AS pending_events,
  (SELECT count(*) FROM "event" WHERE is_approved = true) AS approved_events;

-- Eventi per citta (top 10)
SELECT city, count(*) AS events_count
FROM "event"
GROUP BY city
ORDER BY events_count DESC, city ASC
LIMIT 10;

-- Organizzatori con piu eventi
SELECT u.id, u.name, u.email, count(*) AS events_created
FROM "event" e
JOIN users u ON u.id = e.creator_id
GROUP BY u.id, u.name, u.email
ORDER BY events_created DESC, u.id ASC
LIMIT 10;

-- Partecipazioni per evento
SELECT e.id, e.title, count(up.user_id) AS participants
FROM "event" e
LEFT JOIN user_participations up ON up.event_id = e.id
GROUP BY e.id, e.title
ORDER BY participants DESC, e.id ASC
LIMIT 10;

-- Utenti piu seguiti
SELECT u.id, u.name, count(uf.follower_id) AS followers
FROM users u
LEFT JOIN user_follows uf ON uf.followed_id = u.id
GROUP BY u.id, u.name
ORDER BY followers DESC, u.id ASC
LIMIT 10;

-- REPORTS (seed per dashboard admin)
WITH reasons AS (
  SELECT ARRAY[
    'Spam',
    'Inappropriate content',
    'Harassment',
    'Fake account',
    'Misleading event'
  ] AS arr
)
INSERT INTO reports (
  reporter_id, reported_user_id, reported_event_id, target_type, reason, details, created_at
)
SELECT
  demo.id,
  u.id,
  NULL,
  'USER',
  reasons.arr[1 + floor(random()*array_length(reasons.arr,1))::int],
  'Segnalazione utente da seed per admin.',
  now() - (random()*7)::int * interval '1 day'
FROM (SELECT id FROM users WHERE email = 'demo@lumo.test' LIMIT 1) demo
JOIN LATERAL (
  SELECT id FROM users
  WHERE email <> 'demo@lumo.test'
  ORDER BY random()
  LIMIT 6
) u ON true
CROSS JOIN reasons;

WITH reasons AS (
  SELECT ARRAY[
    'Off-topic',
    'Scam',
    'Duplicate event',
    'Wrong location',
    'Suspicious activity'
  ] AS arr
)
INSERT INTO reports (
  reporter_id, reported_user_id, reported_event_id, target_type, reason, details, created_at
)
SELECT
  admin.id,
  NULL,
  e.id,
  'EVENT',
  reasons.arr[1 + floor(random()*array_length(reasons.arr,1))::int],
  'Segnalazione evento da seed per admin.',
  now() - (random()*7)::int * interval '1 day'
FROM (SELECT id FROM users WHERE email = 'admin@lumo.test' LIMIT 1) admin
JOIN LATERAL (
  SELECT id FROM "event"
  ORDER BY random()
  LIMIT 6
) e ON true
CROSS JOIN reasons;

COMMIT;
