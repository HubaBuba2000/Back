CREATE TABLE profile(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    balance FLOAT DEFAULT 0.0
);

create TABLE transaction(
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    sender_id INTEGER,
    receiver_id INTEGER,
    type: VARCHAR(255),

    FOREIGN KEY (sender_id) references profile(id),
    FOREIGN KEY (receiver_id) references profile(id),
);