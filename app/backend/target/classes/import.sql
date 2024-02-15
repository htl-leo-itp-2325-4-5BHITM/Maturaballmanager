-- Columns are sorted alphabetically descending
insert into company( id
                   , name, website, officeMail)
VALUES (1, 'Facebook', 'https://facebook.com', 'office@facebook.com');
insert into company(id, name, website, officeMail)
VALUES (2, 'Google', 'https://facebook.com', 'office@facebook.com');
insert into company(id, name, website, officeMail)
VALUES (3, 'Amazon', 'https://facebook.com', 'office@facebook.com');
insert into company(id, name, website, officeMail)
VALUES (4, 'HTL', 'https://facebook.com', 'office@facebook.com');
insert into company(id, name, website, officeMail)
VALUES (5, 'Hures', 'https://facebook.com', 'office@facebook.com');

INSERT INTO bill (id, company_id, bookingDate)
VALUES (1, 1, '2024-01-01');
INSERT INTO bill (id, company_id, bookingDate)
VALUES (2, 2, '2024-01-02');
INSERT INTO bill (id, company_id, bookingDate)
VALUES (3, 3, '2024-01-03');
INSERT INTO bill (id, company_id, bookingDate)
VALUES (4, 4, '2024-01-04');
INSERT INTO bill (id, company_id, bookingDate)
VALUES (5, 5, '2024-01-05');

INSERT INTO itemtemplate (id, name, price)
VALUES (1, 'Eintrittskarten, klein', 250);
INSERT INTO itemtemplate (id, name, price)
VALUES (2, 'Eintrittskarten, groß', 500);
INSERT INTO itemtemplate (id, name, price)
VALUES (3, 'Maturazeitung, A5', 500);
INSERT INTO itemtemplate (id, name, price)
VALUES (4, 'Maturazeitung, A4', 750);
INSERT INTO itemtemplate (id, name, price)
VALUES (5, 'Tischkarte', 200);

INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (6, 1, 'Eintrittskarten, klein', 500);
INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (7, 1, 'Programmheft, groß', 250);
INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (8, 1, 'Maturazeitung, klein', 550);
INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (9, 2, 'Beamerpräsentation, kurz', 250);
INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (10, 2, 'Plakat, A5', 200);
INSERT INTO bookeditem (id, bill_id, name, price)
VALUES (11, 3, 'Website, groß', 300);
