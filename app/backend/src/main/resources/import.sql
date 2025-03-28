-- ================================================
-- Import-Skript für die Tabellen: companies und contact_persons
-- ================================================

-- ----------------------------------------
-- Einfügen von Unternehmen (companies)
-- ----------------------------------------

INSERT INTO companies (
    id,
    name,
    industry,
    website,
    office_email,
    office_phone,
    street,
    house_number,
    floor,
    door,
    postal_code,
    city,
    country
) VALUES
-- Unternehmen 1
('00000000-0000-0000-0000-000000000001',
 'Tech Solutions GmbH',
 'IT',
 'https://www.techsolutions.de',
 'contact@techsolutions.de',
 '0123456789',
 'Musterstraße',
 '10',
 '3',
 'B',
 '1010',
 'Wien',
 'AT'),

-- Unternehmen 2
('00000000-0000-0000-0000-000000000002',
 'Bau & Co. AG',
 'Bauwesen',
 'https://www.baucoag.at',
 'info@baucoag.at',
 '0987654321',
 'Bauweg',
 '5',
 '1',
 'A',
 '2020',
 'Graz',
 'AT'),

-- Unternehmen 3
('00000000-0000-0000-0000-000000000003',
 'FinanzPartner Ltd.',
 'Finanzen',
 'https://www.finanzpartner.com',
 'support@finanzpartner.com',
 '0112233445',
 'Finanzstraße',
 '20',
 '5',
 'C',
 '3030',
 'Linz',
 'AT'),

-- Unternehmen 4
('00000000-0000-0000-0000-000000000004',
 'LogistikPro GmbH',
 'Logistik',
 'https://www.logistikpro.de',
 'service@logistikpro.de',
 '0223344556',
 'Transportweg',
 '15',
 '2',
 'D',
 '4040',
 'Salzburg',
 'AT'),

-- Unternehmen 5
('00000000-0000-0000-0000-000000000005',
 'MedizinPlus AG',
 'Gesundheitswesen',
 'https://www.medizinplus.at',
 'kontakt@medizinplus.at',
 '0334455667',
 'Gesundheitsstraße',
 '8',
 '4',
 'E',
 '5050',
 'Innsbruck',
 'AT');

-- ----------------------------------------
-- Einfügen von Kontaktpersonen (contact_persons)
-- ----------------------------------------

-- Kontaktpersonen für Unternehmen 1: Tech Solutions GmbH
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000001',
       'Dr.',
       'Anna',
       'Müller',
       '',
       'W',
       'Geschäftsführerin',
       'anna.mueller@techsolutions.de',
       '0123456789',
       '00000000-0000-0000-0000-000000000001'),

      ('10000000-0000-0000-0000-000000000002',
       '',
       'Max',
       'Schmidt',
       '',
       'M',
       'Leiter IT',
       'max.schmidt@techsolutions.de',
       '0123456790',
       '00000000-0000-0000-0000-000000000001'),

      ('10000000-0000-0000-0000-000000000003',
       'Prof.',
       'Julia',
       'Becker',
       'PhD',
       'W',
       'Senior Entwicklerin',
       'julia.becker@techsolutions.de',
       '0123456791',
       '00000000-0000-0000-0000-000000000001');

-- Kontaktpersonen für Unternehmen 2: Bau & Co. AG
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000004',
       'Ing.',
       'Peter',
       'Weber',
       'BEd',
       'M',
       'Projektmanager',
       'neumaier.tommy@gmail.com',
       '0987654321',
       '00000000-0000-0000-0000-000000000002'),

      ('10000000-0000-0000-0000-000000000005',
       '',
       'Maria',
       'Gruber',
       'MBA',
       'W',
       'Finanzmanagerin',
       'maria.gruber@baucoag.at',
       '0987654322',
       '00000000-0000-0000-0000-000000000002'),

      ('10000000-0000-0000-0000-000000000006',
       'Ing.',
       'Thomas',
       'Hansen',
       '',
       'M',
       'Bauleiter',
       'thomas.hansen@baucoag.at',
       '0987654323',
       '00000000-0000-0000-0000-000000000002');

-- Kontaktpersonen für Unternehmen 3: FinanzPartner Ltd.
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000007',
       'Dr.',
       'Thomas',
       'Klein',
       '',
       'M',
       'Geschäftsführer',
       'thomas.klein@finanzpartner.com',
       '0112233445',
       '00000000-0000-0000-0000-000000000003'),

      ('10000000-0000-0000-0000-000000000008',
       '',
       'Laura',
       'Schneider',
       '',
       'W',
       'Leiterin Finanzen',
       'laura.schneider@finanzpartner.com',
       '0112233446',
       '00000000-0000-0000-0000-000000000003'),

      ('10000000-0000-0000-0000-000000000009',
       'Dipl.',
       'Markus',
       'Lang',
       '',
       'M',
       'Investment Manager',
       'markus.lang@finanzpartner.com',
       '0112233447',
       '00000000-0000-0000-0000-000000000003');

-- Kontaktpersonen für Unternehmen 4: LogistikPro GmbH
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000010',
       '',
       'Sabine',
       'Fischer',
       '',
       'W',
       'Logistikmanagerin',
       'sabine.fischer@logistikpro.de',
       '0223344556',
       '00000000-0000-0000-0000-000000000004'),

      ('10000000-0000-0000-0000-000000000011',
       '',
       'Karl',
       'Meier',
       '',
       'M',
       'Transportleiter',
       'karl.meier@logistikpro.de',
       '0223344557',
       '00000000-0000-0000-0000-000000000004'),

      ('10000000-0000-0000-0000-000000000012',
       '',
       'Eva',
       'Schulz',
       '',
       'W',
       'Supply Chain Manager',
       'eva.schulz@logistikpro.de',
       '0223344558',
       '00000000-0000-0000-0000-000000000004');

-- Kontaktpersonen für Unternehmen 5: MedizinPlus AG
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000013',
       'Dr.',
       'Heinz',
       'Braun',
       '',
       'M',
       'Geschäftsführer',
       'heinz.braun@medizinplus.at',
       '0334455667',
       '00000000-0000-0000-0000-000000000005'),

      ('10000000-0000-0000-0000-000000000014',
       '',
       'Claudia',
       'Weiß',
       '',
       'W',
       'Leiterin Forschung',
       'claudia.weiss@medizinplus.at',
       '0334455668',
       '00000000-0000-0000-0000-000000000005'),

      ('10000000-0000-0000-0000-000000000015',
       '',
       'Frank',
       'Zimmermann',
       '',
       'M',
       'Leiter Qualitätsmanagement',
       'frank.zimmermann@medizinplus.at',
       '0334455669',
       '00000000-0000-0000-0000-000000000005');

-- ----------------------------------------
-- Einfügen von weiteren Unternehmen und Kontaktpersonen (optional)
-- ----------------------------------------

-- Unternehmen 6: KreativKraft AG
INSERT INTO companies (
    id,
    name,
    industry,
    website,
    office_email,
    office_phone,
    street,
    house_number,
    floor,
    door,
    postal_code,
    city,
    country
) VALUES
    ('00000000-0000-0000-0000-000000000006',
     'KreativKraft AG',
     'Marketing',
     'https://www.kreativkraft.com',
     'kontakt@kreativkraft.com',
     '0445566778',
     'Marketingweg',
     '12',
     '2',
     'F',
     '6060',
     'Klagenfurt',
     'AT');

-- Kontaktpersonen für Unternehmen 6: KreativKraft AG
INSERT INTO contact_persons (
    id,
    prefix_title,
    first_name,
    last_name,
    suffix_title,
    gender,
    position,
    personal_email,
    personal_phone,
    company_id
) VALUES
      ('10000000-0000-0000-0000-000000000016',
       '',
       'Daniel',
       'Schmidt',
       '',
       'M',
       'Geschäftsführer',
       'daniel.schmidt@kreativkraft.com',
       '0445566778',
       '00000000-0000-0000-0000-000000000006'),

      ('10000000-0000-0000-0000-000000000017',
       '',
       'Monika',
       'Neumann',
       '',
       'W',
       'Leiterin Kreativabteilung',
       'monika.neumann@kreativkraft.com',
       '0445566779',
       '00000000-0000-0000-0000-000000000006'),

      ('10000000-0000-0000-0000-000000000018',
       '',
       'Stefan',
       'Keller',
       '',
       'M',
       'Digital Marketing Manager',
       'stefan.keller@kreativkraft.com',
       '0445566780',
       '00000000-0000-0000-0000-000000000006');

-- BENEFITS
INSERT INTO benefits(price, description, id, name) VALUES (100, 'Kantine', '00000000-0000-0000-0000-000000000001', 'Kantine'),
(50, 'Firmenhandy', '00000000-0000-0000-0000-000000000002', 'Firmenhandy'),
(200, 'Firmenauto', '00000000-0000-0000-0000-000000000003', 'Firmenauto'),
(150, 'Homeoffice', '00000000-0000-0000-0000-000000000004', 'Homeoffice'),
(300, 'Firmenlaptop', '00000000-0000-0000-0000-000000000005', 'Firmenlaptop'),
(250, 'Firmenhandy', '00000000-0000-0000-0000-000000000006', 'Firmenhandy'),
(100, 'Kantine', '00000000-0000-0000-0000-000000000007', 'Kantine'),
(200, 'Firmenauto', '00000000-0000-0000-0000-000000000008', 'Firmenauto'),
(150, 'Homeoffice', '00000000-0000-0000-0000-000000000009', 'Homeoffice'),
(300, 'Firmenlaptop', '00000000-0000-0000-0000-000000000010', 'Firmenlaptop'),
(250, 'Firmenhandy', '00000000-0000-0000-0000-000000000011', 'Firmenhandy'),
(100, 'Kantine', '00000000-0000-0000-0000-000000000012', 'Kantine'),
(200, 'Firmenauto', '00000000-0000-0000-0000-000000000013', 'Firmenauto'),
(150, 'Homeoffice', '00000000-0000-0000-0000-000000000014', 'Homeoffice'),
(300, 'Firmenlaptop', '00000000-0000-0000-0000-000000000015', 'Firmenlaptop');

-- ================================================
-- Import-Skript für die Tabellen: proms und prom_tagesablauf
-- ================================================

-- ----------------------------------------
-- Einfügen von Proms (proms)
-- ----------------------------------------

INSERT INTO proms (
    id,
    name,
    street,
    house_number,
    floor,
    door,
    postal_code,
    city,
    country,
    date,
    time,
    created_at,
    active
) VALUES
-- Prom 1
('20000000-0000-0000-0000-000000000001',
 'Royal Rumble',
 'Landstraße',
 '49',
 '2',
 'A',
 '4020',
 'Linz',
 'AT',
 '2025-03-07',
 '18:00:00',
 '2023-10-01T10:00:00',
 true);