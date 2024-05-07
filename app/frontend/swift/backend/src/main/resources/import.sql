INSERT INTO Customer (id, sex, firstName, lastName, birthDate, email, phone) VALUES (1, 'M', 'John', 'Doe', '1980-01-01', 'john.doe@example.com', '1234567890');
INSERT INTO Customer (id, sex, firstName, lastName, birthDate, email, phone) VALUES (2, 'F', 'Jane', 'Doe', '1985-01-01', 'jane.doe@example.com', '0987654321');

INSERT INTO Ticket (id, price, vip, customer_id) VALUES (1, 100.00, false, 1);
INSERT INTO Ticket (id, price, vip, customer_id) VALUES (2, 200.00, true, 1);
INSERT INTO Ticket (id, price, vip, customer_id) VALUES (3, 150.00, false, 2);