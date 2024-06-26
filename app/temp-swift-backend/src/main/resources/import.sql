INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (1, 'Max', 'Mustermann', 'male', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (2, 'Erika', 'Musterfrau', 'female', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (3, 'Hans', 'Schmidt', 'male', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (4, 'Anna', 'Schneider', 'female', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (5, 'Peter', 'Müller', 'male', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (6, 'Laura', 'Bauer', 'female', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (7, 'Klaus', 'Fischer', 'male', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (8, 'Petra', 'Weber', 'female', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (9, 'Uwe', 'Hoffmann', 'male', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (10, 'Gabi', 'Zimmermann', 'female', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (11, 'Lana', 'Sekerija', 'female', true);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (12, 'Yasin', 'Erkol', 'male', false);
INSERT INTO Users (id, firstName, lastName, sex, vipStatus) VALUES (13, 'Tommy', 'Neumaier', 'male', false);

INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (1, false, '2024-06-04 10:00:00', false, 1);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (2, true, '2024-06-04 11:00:00', false, 2);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (3, true, '2024-06-04 12:00:00', true, 3);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (4, false, '2024-06-04 13:00:00', true, 4);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (5, true, '2024-06-04 14:00:00', false, 5);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (6, false, '2024-06-04 15:00:00', true, 6);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (7, true, '2024-06-04 16:00:00', false, 7);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (8, false, '2024-06-04 17:00:00', true, 8);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (9, true, '2024-06-04 18:00:00', false, 9);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (10, false, '2024-06-04 19:00:00', true, 10);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (11, false, '2024-06-04 19:00:00', false, 11);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (12, false, '2024-06-04 19:00:00', true, 12);
INSERT INTO Ticket (id, qrCreated, createdAt, redeemed, user_id) VALUES (13, false, '2024-06-04 19:00:00', false, 13);

INSERT INTO FAQItem (id, priority, question, answer) VALUES
    (1, 6,
     'Was ist die Maturaballmanager-App?',
     'Die Maturaballmanager-App ist eine mobile Anwendung zur Unterstützung vom Entwerten der Maturaballtickets.');

INSERT INTO FAQItem (id, priority, question, answer) VALUES
    (2, 5,
     'Wie verwende ich den QR-Scanner?',
     'Gehen Sie zum Menü und wählen Sie das Icon "QR-Scanner". Richten Sie die Kamera Ihres Gerätes auf den QR-Code des Tickets, bis der Code automatisch gescannt wird.');

INSERT INTO FAQItem(id, priority, question, answer) VALUES
    (3, 4,
     'Was passiert, nachdem ich ein Ticket gescannt habe?',
     'Nach dem Scannen des QR-Codes wird die Gültigkeit des Tickets überprüft. Wenn das Ticket gültig ist, wird eine Bestätigung angezeigt. Andernfalls erhalten Sie eine Fehlermeldung.');

INSERT INTO FAQItem(id, priority, question, answer) VALUES
    (4, 3,
     'Welche Art von QR-Codes kann der Scanner lesen?',
     'Der Scanner kann die QR-Codes lesen, die speziell für die Eintrittskarten des Maturaballs der HTL Leonding generiert wurden.');

INSERT INTO FAQItem(id, priority, question, answer) VALUES
    (5, 2,
     'Was mache ich, wenn der QR-Scanner nicht funktioniert?',
     'Stellen Sie sicher, dass die Kamera Ihres Geräts nicht blockiert ist und dass ausreichend Licht vorhanden ist. Überprüfen Sie, ob Sie der App die Berechtigung zur Nutzung der Kamera erteilt haben. Starten Sie die App neu und versuchen Sie es erneut. Wenn das Problem weiterhin besteht, wenden Sie sich an den Support.');

INSERT INTO FAQItem(id, priority, question, answer) VALUES
                                                        (6, 1,
                                                        'Kann ich gescannte Tickets erneut verwenden?',
                                                        'Nein, einmal gescannte Tickets werden als verwendet markiert und können nicht erneut für den Einlass genutzt werden.');


