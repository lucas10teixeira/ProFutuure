


create database db_tasks;
use db_tasks;

create table task(
    id int auto_increment primary key,
    nome varchar(30) not null,
    email varchar(50) unique not null,
    sobre varchar(90) null,
	senha varchar(30)  not null

);
DROP TABLE TASK;

SELECT * FROM task;

create table feed(
    id int auto_increment primary key,
    descricao varchar(100) not null,
    user_id int not null,
    foreign key (user_id) references task(id)
);
select * from feed;

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thumbnail VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);
drop table videos;

drop table feed;
select * from videos;