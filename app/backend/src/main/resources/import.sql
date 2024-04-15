insert into company(id, name, website, officeMail, officephone, status)
VALUES (1, 'Facebook', 'https://facebook.com', 'office@facebook.com', '066', 'ACTIVE'),
       (2, 'Google', 'https://facebook.com', 'office@facebook.com', '325', 'INACTIVE'),
       (3, 'Amazon', 'https://facebook.com', 'office@facebook.com', '325', 'INACTIVE'),
       (4, 'HTL', 'https://facebook.com', 'office@facebook.com', '325', 'INACTIVE'),
       (5, 'Nicht Facebook', 'https://facebook.com', 'office@facebook.com', '325', 'PROGRESS');

insert into contactperson( id, firstname, lastname, mail, sex, position)
    values
    (1, 'Mark', 'Zuckerberg', 'zuckerberg@facebook.com', 'M', 'CEO');

INSERT INTO invoice (id, company_id, bookingDate)
VALUES (1, 1, '2024-01-01'),
       (2, 2, '2024-01-02'),
       (3, 3, '2024-01-03'),
       (4, 4, '2024-01-04'),
       (5, 5, '2024-01-05');

INSERT INTO itemtemplate (id, name, price)
VALUES (1, 'Eintrittskarten, klein', 250),
       (2, 'Eintrittskarten, groß', 500),
       (3, 'Maturazeitung, A5', 500),
       (4, 'Maturazeitung, A4', 750),
       (5, 'Tischkarte', 200);

INSERT INTO bookeditem (id, invoice_id, name, price)
VALUES (6, 1, 'Eintrittskarten, klein', 500),
       (7, 1, 'Programmheft, groß', 250),
       (8, 1, 'Maturazeitung, klein', 550),
       (9, 2, 'Beamerpräsentation, kurz', 250),
       (10, 2, 'Plakat, A5', 200),
       (11, 3, 'Website, groß', 300);