DROP TABLE IF EXISTS users, groups, usergroup;
CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY primary key,
  login varchar(20) not null unique,
  password varchar(50) not null,
  age integer not null,
  is_deleted boolean not null default false
);
CREATE TABLE groups (
  id integer GENERATED ALWAYS AS IDENTITY primary key,
  name varchar(40) not null unique,
  permissions varchar(10) ARRAY not null
);
CREATE TABLE usergroup (
    id integer GENERATED ALWAYS AS IDENTITY primary key,
    group_id integer not null,
    user_id integer not null,
    constraint fk_groups foreign key(group_id) references groups(id),
    constraint fk_users foreign key(user_id) references users(id)
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