-- Initialisierung der Tabelle User
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (1, 'John', 'Doe', 'male', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (2, 'Jane', 'Doe', 'female', false);

-- Initialisierung der Tabelle Ticket
INSERT INTO Ticket (id, qrCreated, redeemed, user_id) VALUES (1, false, false, 1);
INSERT INTO Ticket (id, qrCreated, redeemed, user_id) VALUES (2, true, false, 2);
