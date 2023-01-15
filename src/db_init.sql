DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY primary key,
  login varchar(20) not null unique,
  password varchar(50) not null,
  age integer not null,
  is_deleted boolean not null default false
);
INSERT INTO users (
    login,
    password,
    age
)
values
    (
        'awesomeuser123',
        'password123',
        27
    ),
    (
        'karina1997',
        '1q2w3e4r5t',
         25
    ),
    (
        'grumpy_cat',
        'giveme999food',
        35
    ),
    (
        'flashpoint',
        'gdwsjklgjw5654',
        28
    ),
    (
        'bigman12',
        'sdgds4332d',
        25
    );