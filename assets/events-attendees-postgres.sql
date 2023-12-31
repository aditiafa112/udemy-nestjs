INSERT INTO "event" ("id", "description", "when", "address", "name") VALUES
(1,	'Let\''s meet together.',	'2021-02-15 21:00:00',	'Office St 120',	'Team Meetup'),
(2,	'Let\''s learn something.',	'2021-02-17 21:00:00',	'Workshop St 80',	'Workshop'),
(3,	'Let\''s meet with big bosses',	'2021-02-17 21:00:00',	'Boss St 100',	'Strategy Meeting'),
(4,	'Let\''s try to sell stuff',	'2021-02-11 21:00:00',	'Money St 34',	'Sales Pitch'),
(5,	'People meet to talk about business ideas',	'2021-02-12 21:00:00',	'Invention St 123',	'Founders Meeting');

INSERT INTO "attendee" ("id", "name", "eventId") VALUES
(1, 'Piotr', 1),
(2, 'John', 1),
(3, 'Terry', 1),
(4, 'Bob', 2),
(5, 'Joe', 2),
(6, 'Donald', 2),
(7, 'Harry', 4);