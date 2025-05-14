-- schema.sql for NIIT School Management App (Supabase/Postgres)

-- Users table
create table users (
  id serial primary key,
  username varchar(100) not null,
  email varchar(255) not null unique,
  password varchar(255) not null,
  created_at timestamp with time zone default now()
);

-- Courses table
create table courses (
  id serial primary key,
  name varchar(100) not null unique,
  description text,
  duration varchar(50),
  created_at timestamp with time zone default now()
);

-- Students table
create table students (
  id serial primary key,
  name varchar(100) not null,
  email varchar(255) not null unique,
  program varchar(100),
  course_id integer references courses(id) on delete set null,
  phone varchar(20),
  status varchar(20) default 'Active',
  created_at timestamp with time zone default now()
);

-- Attendance table
create table attendance (
  id serial primary key,
  student_id integer references students(id) on delete cascade,
  date date not null,
  present boolean not null,
  remarks varchar(255),
  unique(student_id, date)
);

-- Quizzes table
create table quizzes (
  id serial primary key,
  title varchar(100) not null,
  course_id integer references courses(id) on delete cascade,
  file_url text,
  date date default current_date
);

-- Events table (for dashboard/upcoming events)
create table events (
  id serial primary key,
  title varchar(100) not null,
  event_date date not null,
  description text
);

-- Indexes for performance
create index idx_attendance_date on attendance(date);
create index idx_students_course on students(course_id);
