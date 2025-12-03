-- -------------------------------------------------------------
-- TablePlus 6.7.1(636)
--
-- https://tableplus.com/
--
-- Database: lis
-- Generation Time: 2025-10-05 22:53:01.4910
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."staff";
-- Table Definition
CREATE TABLE "public"."staff" (
    "staff_fname" varchar(80) NOT NULL,
    "staff_lname" varchar(80) NOT NULL,
    "id" varchar(20) NOT NULL,
    "gender" varchar(1) NOT NULL,
    "mobile_no" numeric(10,0) NOT NULL,
    "doj" date NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."book_catalogue";
-- Table Definition
CREATE TABLE "public"."book_catalogue" (
    "isbn_no" varchar(50) NOT NULL,
    "title" varchar(256) NOT NULL,
    "publisher" varchar(80) NOT NULL,
    "year" int4 NOT NULL,
    PRIMARY KEY ("isbn_no")
);

DROP TABLE IF EXISTS "public"."book_authors";
-- Table Definition
CREATE TABLE "public"."book_authors" (
    "isbn_no" varchar(13) NOT NULL,
    "author_fname" varchar(80) NOT NULL,
    "author_lname" varchar(80) NOT NULL,
    PRIMARY KEY ("isbn_no","author_fname","author_lname")
);

DROP TABLE IF EXISTS "public"."book_copies";
-- Table Definition
CREATE TABLE "public"."book_copies" (
    "isbn_no" varchar(13) NOT NULL,
    "accession_no" varchar(20) NOT NULL,
    PRIMARY KEY ("accession_no")
);

DROP TABLE IF EXISTS "public"."members";
-- Table Definition
CREATE TABLE "public"."members" (
    "member_no" varchar(20) NOT NULL,
    "member_class" varchar(20) NOT NULL,
    "member_type" varchar(2) NOT NULL,
    "roll_no" varchar(20),
    "id" varchar(20),
    PRIMARY KEY ("member_no")
);

DROP TABLE IF EXISTS "public"."book_issue";
-- Table Definition
CREATE TABLE "public"."book_issue" (
    "member_no" varchar(20) NOT NULL,
    "accession_no" varchar(20) NOT NULL,
    "doi" date NOT NULL,
    PRIMARY KEY ("member_no","accession_no")
);

DROP TABLE IF EXISTS "public"."departments";
-- Table Definition
CREATE TABLE "public"."departments" (
    "department_code" varchar(80) NOT NULL,
    "department_name" varchar(80),
    "department_building" varchar(80),
    PRIMARY KEY ("department_code")
);

DROP TABLE IF EXISTS "public"."faculty";
-- Table Definition
CREATE TABLE "public"."faculty" (
    "faculty_fname" varchar(80) NOT NULL,
    "faculty_lname" varchar(80) NOT NULL,
    "id" varchar(20) NOT NULL,
    "department_code" varchar(80) NOT NULL,
    "gender" varchar(1) NOT NULL,
    "mobile_no" numeric(10,0) NOT NULL,
    "doj" date NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."students";
-- Table Definition
CREATE TABLE "public"."students" (
    "student_fname" varchar(80) NOT NULL,
    "student_lname" varchar(80) NOT NULL,
    "roll_no" varchar(20) NOT NULL,
    "department_code" varchar(80) NOT NULL,
    "gender" varchar(1) NOT NULL,
    "mobile_no" numeric(10,0) NOT NULL,
    "dob" date NOT NULL,
    "degree" varchar(80) NOT NULL,
    PRIMARY KEY ("roll_no")
);

DROP TABLE IF EXISTS "public"."quota";
-- Table Definition
CREATE TABLE "public"."quota" (
    "member_type" varchar(2) NOT NULL,
    "max_books" int4 NOT NULL,
    "max_duration" int4 NOT NULL,
    PRIMARY KEY ("member_type")
);

INSERT INTO "public"."staff" ("staff_fname", "staff_lname", "id", "gender", "mobile_no", "doj") VALUES
('Vikas', 'Kundu', 'S01', 'M', 8967123456, '2010-09-16'),
('Ashish', 'Raval', 'S02', 'M', 8967123446, '2009-09-26'),
('Dharmendra', 'Shaw', 'S03', 'M', 8967123436, '2010-09-06'),
('Amar', 'Koli', 'S04', 'M', 8967123426, '2011-09-26'),
('Rohit', 'Halder', 'S05', 'M', 8967123256, '2000-09-06'),
('Manjula', 'Pathak', 'S06', 'F', 8967123356, '2010-09-26'),
('Sushil', 'Tivari', 'S07', 'F', 8967123756, '2015-02-16'),
('Anjali', 'Sen', 'S08', 'F', 8967121456, '2020-07-26'),
('Rinku', 'Soni', 'S09', 'F', 8967122456, '2010-09-26'),
('Lila', 'Das', 'S10', 'F', 8967124456, '2010-08-02');

INSERT INTO "public"."book_catalogue" ("isbn_no", "title", "publisher", "year") VALUES
('9780984782864', 'Cracking the Coding Interview (Indian Edition)', 'CareerCup', 2015),
('9781316601853', 'Basic Computation and Programming with C', 'Cambridge University Press', 2017),
('9788120348424', 'Database Management System Oracle SQL', 'Prentice Hall India Learning Private Limited', 2013),
('9788126563050', 'Machine Learning (in Python and R) For Dummies', 'Wiley', 2016),
('9788126568932', 'Blockchain for Dummies', 'Wiley', 2017),
('9788126576104', 'Artificial Intelligence For Dummies', 'Wiley', 2018),
('9788131705216', 'The C++ Programming Language', 'Pearson Education India', 2002),
('9788131773383', 'Clean Code', 'Pearson Education', 2012),
('9789332543553', 'Programming in C', 'Pearson Education India', 2015),
('9789332549449', 'The C Programming Language', 'Pearson Education India', 2015),
('9789351197584', 'Java 8 Programming Black Book', 'Dreamtech Press', 2015),
('9789351198147', 'Learning with Python', 'Dreamtech Press', 2015),
('9789351199380', 'Advanced Database Management System', 'Dreamtech Press', 2017),
('9789351343202', 'Programming in ANSI C', 'McGraw Hill Education', 2019),
('9789352604166', 'Computing Fundamentals and C Programming', 'McGraw Hill Education', 2017),
('9789352921171', 'Computer Science Textbook For Class 11', 'NCERT', 2019),
('9789386551337', 'Coding For Beginners In Easy Steps', 'BPB', 2017),
('9789386551375', 'Excel Vba In Easy Steps', 'BPB', 2017),
('9789386601407', 'Handbook of Computer Science & IT', 'G.K. Pub', 2017),
('9789388176644', 'Let us C++', 'BPB Publications', 2020);

INSERT INTO "public"."book_authors" ("isbn_no", "author_fname", "author_lname") VALUES
('9780984782864', 'Gayle Laakmann', 'McDowell'),
('9781316601853', 'Subrata', 'Saha'),
('9788120348424', 'Gupta', 'D'),
('9788126563050', 'Joh Paul', 'Mueller'),
('9788126568932', 'Tiana', 'Laurence'),
('9788126576104', 'Joh Paul', 'Mueller'),
('9788131705216', 'Bjarne', 'STROUSTRUP'),
('9788131773383', 'Robert C', 'Martin'),
('9789332543553', 'Kamthane', 'sah'),
('9789332549449', 'Brian W', 'Kernighan'),
('9789332549449', 'Dennis', 'Ritchie'),
('9789351197584', 'D.T', 'Editorial Services'),
('9789351198147', 'Allen', 'Downey'),
('9789351199380', 'Jitendra', 'Agrawal'),
('9789351199380', 'Sanjeev', 'Sharma'),
('9789351199380', 'Shikha', 'Agrawal'),
('9789351343202', 'E', 'Balagurusamy'),
('9789352604166', 'E', 'Balagurusamy'),
('9789352921171', 'NCERT', ' '),
('9789386551337', 'Mike', 'Mcgrath'),
('9789386551375', 'Mike', 'Mcgrath'),
('9789386601407', 'G', 'KP'),
('9789388176644', 'Yashavant', 'Kanetkar');

INSERT INTO "public"."book_copies" ("isbn_no", "accession_no") VALUES
('9780984782864', '9780984782864A'),
('9780984782864', '9780984782864B'),
('9780984782864', '9780984782864C'),
('9781316601853', '9781316601853A'),
('9781316601853', '9781316601853B'),
('9781316601853', '9781316601853C'),
('9788120348424', '9788120348424A'),
('9788120348424', '9788120348424B'),
('9788120348424', '9788120348424C'),
('9788126563050', '9788126563050A'),
('9788126563050', '9788126563050B'),
('9788126563050', '9788126563050C'),
('9788126568932', '9788126568932A'),
('9788126568932', '9788126568932B'),
('9788126568932', '9788126568932C'),
('9788126576104', '9788126576104A'),
('9788126576104', '9788126576104B'),
('9788126576104', '9788126576104C'),
('9788131705216', '9788131705216A'),
('9788131705216', '9788131705216B'),
('9788131705216', '9788131705216C'),
('9788131773383', '9788131773383A'),
('9788131773383', '9788131773383B'),
('9788131773383', '9788131773383C'),
('9789332543553', '9789332543553A'),
('9789332543553', '9789332543553B'),
('9789332543553', '9789332543553C'),
('9789332549449', '9789332549449A'),
('9789332549449', '9789332549449B'),
('9789332549449', '9789332549449C'),
('9789351197584', '9789351197584A'),
('9789351197584', '9789351197584B'),
('9789351197584', '9789351197584C'),
('9789351198147', '9789351198147A'),
('9789351198147', '9789351198147B'),
('9789351198147', '9789351198147C'),
('9789351199380', '9789351199380A'),
('9789351199380', '9789351199380B'),
('9789351199380', '9789351199380C'),
('9789351343202', '9789351343202A'),
('9789351343202', '9789351343202B'),
('9789351343202', '9789351343202C'),
('9789352604166', '9789352604166A'),
('9789352604166', '9789352604166B'),
('9789352604166', '9789352604166C'),
('9789352921171', '9789352921171A'),
('9789352921171', '9789352921171B'),
('9789352921171', '9789352921171C'),
('9789386551337', '9789386551337A'),
('9789386551337', '9789386551337B'),
('9789386551337', '9789386551337C'),
('9789386551375', '9789386551375A'),
('9789386551375', '9789386551375B'),
('9789386551375', '9789386551375C'),
('9789386601407', '9789386601407A'),
('9789386601407', '9789386601407B'),
('9789386601407', '9789386601407C'),
('9789388176644', '9789388176644A'),
('9789388176644', '9789388176644B'),
('9789388176644', '9789388176644C');

INSERT INTO "public"."members" ("member_no", "member_class", "member_type", "roll_no", "id") VALUES
('M0001', 'Student', 'UG', 'CS01', NULL),
('M0002', 'Student', 'UG', 'CS02', NULL),
('M0003', 'Student', 'UG', 'CS03', NULL),
('M0004', 'Student', 'UG', 'CS04', NULL),
('M0005', 'Student', 'UG', 'CS05', NULL),
('M0006', 'Student', 'UG', 'CS06', NULL),
('M0007', 'Student', 'UG', 'CS07', NULL),
('M0008', 'Student', 'UG', 'CS08', NULL),
('M0009', 'Student', 'UG', 'CS09', NULL),
('M0010', 'Student', 'UG', 'CS10', NULL),
('M0011', 'Student', 'UG', 'CS11', NULL),
('M0012', 'Student', 'UG', 'CS12', NULL),
('M0013', 'Student', 'UG', 'CS13', NULL),
('M0014', 'Student', 'UG', 'CS14', NULL),
('M0015', 'Student', 'UG', 'CS15', NULL),
('M0016', 'Student', 'UG', 'CS16', NULL),
('M0017', 'Student', 'UG', 'ME01', NULL),
('M0018', 'Student', 'UG', 'ME02', NULL),
('M0019', 'Student', 'UG', 'ME03', NULL),
('M0020', 'Student', 'UG', 'ME04', NULL),
('M0021', 'Student', 'UG', 'ME05', NULL),
('M0022', 'Student', 'UG', 'ME06', NULL),
('M0023', 'Student', 'UG', 'ME07', NULL),
('M0024', 'Student', 'UG', 'ME15', NULL),
('M0025', 'Student', 'UG', 'ME09', NULL),
('M0026', 'Student', 'UG', 'ME10', NULL),
('M0027', 'Student', 'UG', 'ME11', NULL),
('M0028', 'Student', 'UG', 'ME12', NULL),
('M0029', 'Student', 'UG', 'ME13', NULL),
('M0030', 'Student', 'UG', 'ME14', NULL),
('M0031', 'Student', 'UG', 'EE01', NULL),
('M0032', 'Student', 'UG', 'EE02', NULL),
('M0033', 'Student', 'UG', 'EE03', NULL),
('M0034', 'Student', 'UG', 'EE04', NULL),
('M0035', 'Student', 'UG', 'EE05', NULL),
('M0036', 'Student', 'UG', 'EE06', NULL),
('M0037', 'Student', 'UG', 'EE07', NULL),
('M0038', 'Student', 'UG', 'EE08', NULL),
('M0039', 'Student', 'UG', 'EE09', NULL),
('M0040', 'Student', 'UG', 'EE10', NULL),
('M0041', 'Student', 'UG', 'EE11', NULL),
('M0042', 'Student', 'UG', 'EE12', NULL),
('M0043', 'Student', 'PG', 'MCA01', NULL),
('M0044', 'Student', 'PG', 'MCA02', NULL),
('M0045', 'Student', 'PG', 'MCA03', NULL),
('M0046', 'Student', 'PG', 'MCA04', NULL),
('M0047', 'Student', 'PG', 'MCA05', NULL),
('M0048', 'Student', 'PG', 'MCA06', NULL),
('M0049', 'Student', 'PG', 'MCA07', NULL),
('M0050', 'Student', 'PG', 'MCA08', NULL),
('M0051', 'Student', 'PG', 'MCA09', NULL),
('M0052', 'Student', 'PG', 'MCA10', NULL),
('M0053', 'Faculty', 'FC', NULL, 'FCS01'),
('M0054', 'Faculty', 'FC', NULL, 'FCS02'),
('M0055', 'Faculty', 'FC', NULL, 'FCS03'),
('M0056', 'Faculty', 'FC', NULL, 'FCS04'),
('M0057', 'Faculty', 'FC', NULL, 'FME01'),
('M0058', 'Faculty', 'FC', NULL, 'FME02'),
('M0059', 'Faculty', 'FC', NULL, 'FME03'),
('M0060', 'Faculty', 'FC', NULL, 'FME04'),
('M0061', 'Faculty', 'FC', NULL, 'FEE01'),
('M0062', 'Faculty', 'FC', NULL, 'FEE02'),
('M0063', 'Faculty', 'FC', NULL, 'FEE03'),
('M0064', 'Faculty', 'FC', NULL, 'FEE04'),
('M0065', 'Faculty', 'FC', NULL, 'FMCA01'),
('M0066', 'Faculty', 'FC', NULL, 'FMCA02'),
('M0067', 'Faculty', 'FC', NULL, 'FMCA03'),
('M0068', 'Faculty', 'FC', NULL, 'FMCA04');

INSERT INTO "public"."book_issue" ("member_no", "accession_no", "doi") VALUES
('M0001', '9789351199380A', '2021-08-01'),
('M0002', '9789351199380B', '2021-08-02'),
('M0003', '9789351197584B', '2021-08-03'),
('M0004', '9789351197584C', '2021-08-04'),
('M0005', '9789386601407A', '2021-08-05'),
('M0006', '9789351343202B', '2021-08-06'),
('M0007', '9789351343202C', '2021-08-07'),
('M0008', '9788131773383A', '2021-08-08'),
('M0009', '9788131773383B', '2021-08-01'),
('M0010', '9788131705216C', '2021-08-09'),
('M0011', '9788126568932B', '2021-08-01'),
('M0012', '9788126576104A', '2021-08-10'),
('M0013', '9789351198147B', '2021-08-01'),
('M0014', '9789388176644C', '2021-08-11'),
('M0020', '9789386551337A', '2021-07-03'),
('M0038', '9780984782864B', '2021-08-11'),
('M0045', '9789332543553C', '2021-08-01'),
('M0045', '9789386551337C', '2021-07-02'),
('M0048', '9789332543553B', '2021-08-01'),
('M0050', '9789332543553A', '2021-08-11'),
('M0060', '9789386551337B', '2021-07-01');

INSERT INTO "public"."departments" ("department_code", "department_name", "department_building") VALUES
('CS', 'Computer Science', 'Block_1'),
('EE', 'Electrical Engineering', 'Block_3'),
('MCA', 'Master Of Computer Application', 'Block_4'),
('ME', 'Mechanical Engineering', 'Block_2');

INSERT INTO "public"."faculty" ("faculty_fname", "faculty_lname", "id", "department_code", "gender", "mobile_no", "doj") VALUES
('Sanchit', 'Jain', 'FCS01', 'CS', 'M', 8972000000, '2017-01-02'),
('Sumanta', 'Kuiley', 'FCS02', 'CS', 'M', 8972000001, '2016-01-03'),
('Shantanu', 'Kuiley', 'FCS03', 'CS', 'M', 8972000002, '2015-03-04'),
('Arpita', 'Das', 'FCS04', 'CS', 'F', 8972000003, '2010-01-05'),
('jitendra', 'raj', 'FEE01', 'EE', 'M', 8972000008, '2015-06-10'),
('Prakash', 'Maji', 'FEE02', 'EE', 'M', 8972000009, '2015-06-11'),
('Surendra', 'rana', 'FEE03', 'EE', 'M', 8972000010, '2015-06-12'),
('Kavita', 'Saha', 'FEE04', 'EE', 'F', 8972000011, '2015-06-13'),
('Vijaya', 'Bhoi', 'FMCA01', 'MCA', 'M', 8159400000, '2013-07-23'),
('Sachin', 'Dey', 'FMCA02', 'MCA', 'M', 8159400000, '2013-06-23'),
('Raja', 'Jahan', 'FMCA03', 'MCA', 'M', 8159400001, '2013-11-22'),
('Lata', 'Saw', 'FMCA04', 'MCA', 'F', 8159400002, '2013-11-21'),
('Pinki', 'Mandal', 'FMCA05', 'MCA', 'F', 8159400003, '2013-12-20'),
('Sanchit', 'Paramanik', 'FME01', 'ME', 'M', 8972000004, '2016-02-06'),
('Pramad', 'Mahto', 'FME02', 'ME', 'M', 8972000005, '2016-03-07'),
('Subhash', 'Das', 'FME03', 'ME', 'M', 8972000006, '2016-04-08'),
('Sanchita', 'saha', 'FME04', 'ME', 'F', 8972000007, '2016-05-09');

INSERT INTO "public"."students" ("student_fname", "student_lname", "roll_no", "department_code", "gender", "mobile_no", "dob", "degree") VALUES
('Vikas', 'Das', 'CS01', 'CS', 'M', 9002000000, '2002-05-09', 'B.Tech'),
('Rajib', 'Das', 'CS02', 'CS', 'M', 9002000001, '2002-04-09', 'B.Tech'),
('David', 'Rajak', 'CS03', 'CS', 'M', 9002000002, '2002-03-05', 'B.Tech'),
('John', 'Chattarjee', 'CS04', 'CS', 'M', 9002000003, '2002-02-09', 'B.Tech'),
('Robert', 'Junior', 'CS05', 'CS', 'M', 9002000004, '2002-01-07', 'B.Tech'),
('Arup', 'Layek', 'CS06', 'CS', 'M', 9002000005, '2002-10-05', 'B.Tech'),
('Susmita', 'Das', 'CS07', 'CS', 'F', 9002000006, '2002-10-04', 'B.Tech'),
('Soma', 'Gorai', 'CS08', 'CS', 'F', 9002000007, '2002-10-03', 'B.Tech'),
('Suman', 'Kumari', 'CS09', 'CS', 'F', 9002000008, '2002-10-02', 'B.Tech'),
('Payel', 'Mandal', 'CS10', 'CS', 'F', 9002000009, '2002-10-01', 'B.Tech'),
('Puja', 'Biswas', 'CS11', 'CS', 'F', 9002000030, '2003-06-28', 'B.Tech'),
('Sataskhi', 'Mahato', 'CS12', 'CS', 'F', 9002000031, '2003-06-29', 'B.Tech'),
('Sita', 'Nayak', 'CS13', 'CS', 'F', 9002000032, '2003-12-30', 'B.Tech'),
('Laxmi', 'Sarkar', 'CS14', 'CS', 'F', 9002000033, '2002-06-01', 'B.Tech'),
('Pushpa', 'Das', 'CS15', 'CS', 'F', 9002000034, '2003-05-02', 'B.Tech'),
('Diptangsu', 'Ma', 'CS16', 'CS', 'M', 9002000035, '2003-06-03', 'B.Tech'),
('Raju', 'Kumar', 'EE01', 'EE', 'M', 9002000017, '2002-05-17', 'B.Tech'),
('Suman', 'Lal', 'EE02', 'EE', 'M', 9002000018, '2003-01-18', 'B.Tech'),
('Vinod', 'Mandal', 'EE03', 'EE', 'M', 9002000019, '2003-02-19', 'B.Tech'),
('Rajendra', 'Khatun', 'EE04', 'EE', 'M', 9002000020, '2002-03-20', 'B.Tech'),
('Abdul', 'Ali', 'EE05', 'EE', 'M', 9002000021, '2003-04-21', 'B.Tech'),
('Gita', 'Das', 'EE06', 'EE', 'F', 9002000022, '2003-04-22', 'B.Tech'),
('Arijit', 'Sahu', 'EE07', 'EE', 'M', 9002000023, '2003-06-22', 'B.Tech'),
('Subham', 'Gupta', 'EE08', 'EE', 'M', 9002000024, '2003-04-23', 'B.Tech'),
('Santanu', 'Ghosh', 'EE09', 'EE', 'M', 9002000025, '2003-04-24', 'B.Tech'),
('Sourav', 'Patel', 'EE10', 'EE', 'M', 9002000026, '2003-03-25', 'B.Tech'),
('Rahul', 'Roy', 'EE11', 'EE', 'M', 9002000027, '2003-02-26', 'B.Tech'),
('Sunita', 'Paramanik', 'EE12', 'EE', 'F', 9002000028, '2003-01-27', 'B.Tech'),
('Tanay', 'Sarkar', 'MCA01', 'MCA', 'M', 9002000043, '2002-06-10', 'MCA'),
('Pramad', 'Pawar', 'MCA02', 'MCA', 'M', 9002000044, '2002-06-11', 'MCA'),
('Surendra', 'Malik', 'MCA03', 'MCA', 'M', 9002000045, '2006-06-12', 'MCA'),
('Joyti', 'Nath', 'MCA04', 'MCA', 'M', 9002000046, '2002-06-13', 'MCA'),
('Prakash', 'Sardar', 'MCA05', 'MCA', 'M', 9002000047, '2002-06-14', 'MCA'),
('Rahul', 'Singh', 'MCA06', 'MCA', 'M', 9002000048, '2002-06-15', 'MCA'),
('Savita', 'Das', 'MCA07', 'MCA', 'F', 9002000049, '2002-06-15', 'MCA'),
('Rina', 'Mahato', 'MCA08', 'MCA', 'F', 9002000050, '2002-06-17', 'MCA'),
('Rima', 'Layek', 'MCA09', 'MCA', 'F', 9002000051, '2002-06-18', 'MCA'),
('Nirmala', 'Das', 'MCA10', 'MCA', 'F', 9002000052, '2002-06-19', 'MCA'),
('Ramesh', 'Samant', 'ME01', 'ME', 'M', 9002000010, '2003-05-10', 'B.Tech'),
('Anil', 'Pratap', 'ME02', 'ME', 'M', 9002000011, '2003-04-11', 'B.Tech'),
('Vijay', 'Dubey', 'ME03', 'ME', 'M', 9002000012, '2003-03-12', 'B.Tech'),
('Suresh', 'Singh', 'ME04', 'ME', 'M', 9002000013, '2003-02-13', 'B.Tech'),
('Sanjay', 'Mollya', 'ME05', 'ME', 'M', 9002000014, '2003-01-14', 'B.Tech'),
('Santash', 'Thorat', 'ME06', 'ME', 'M', 9002000015, '2003-06-15', 'B.Tech'),
('Argha', 'Bee', 'ME07', 'ME', 'M', 9002000016, '2003-07-16', 'B.Tech'),
('Dilip', 'Nayak', 'ME09', 'ME', 'M', 9002000036, '2002-06-03', 'B.Tech'),
('Kiran', 'Das', 'ME10', 'ME', 'M', 9002000037, '2002-06-04', 'B.Tech'),
('Ajay', 'Mahato', 'ME11', 'ME', 'M', 9002000038, '2002-11-05', 'B.Tech'),
('Shankar', 'Rathod', 'ME12', 'ME', 'M', 9002000039, '2002-06-06', 'B.Tech'),
('Sushila', 'Saha', 'ME13', 'ME', 'F', 9002000040, '2002-12-07', 'B.Tech'),
('Rita', 'Thakur', 'ME14', 'ME', 'F', 9002000041, '2002-06-08', 'B.Tech'),
('Sita', 'Mandal', 'ME15', 'ME', 'F', 9002000042, '2002-06-09', 'B.Tech');

INSERT INTO "public"."quota" ("member_type", "max_books", "max_duration") VALUES
('FC', 15, 30),
('PG', 12, 24),
('RS', 15, 30),
('UG', 10, 20);



-- Indices
CREATE UNIQUE INDEX staff_pk ON public.staff USING btree (id);


-- Indices
CREATE UNIQUE INDEX book_catalogue_pk ON public.book_catalogue USING btree (isbn_no);
ALTER TABLE "public"."book_authors" ADD FOREIGN KEY ("isbn_no") REFERENCES "public"."book_catalogue"("isbn_no");


-- Indices
CREATE UNIQUE INDEX book_authors_pk ON public.book_authors USING btree (isbn_no, author_fname, author_lname);
ALTER TABLE "public"."book_copies" ADD FOREIGN KEY ("isbn_no") REFERENCES "public"."book_catalogue"("isbn_no");


-- Indices
CREATE UNIQUE INDEX book_copies_pk ON public.book_copies USING btree (accession_no);
ALTER TABLE "public"."members" ADD FOREIGN KEY ("id") REFERENCES "public"."faculty"("id");
ALTER TABLE "public"."members" ADD FOREIGN KEY ("member_type") REFERENCES "public"."quota"("member_type");
ALTER TABLE "public"."members" ADD FOREIGN KEY ("roll_no") REFERENCES "public"."students"("roll_no");


-- Indices
CREATE UNIQUE INDEX members_pk ON public.members USING btree (member_no);
ALTER TABLE "public"."book_issue" ADD FOREIGN KEY ("accession_no") REFERENCES "public"."book_copies"("accession_no");
ALTER TABLE "public"."book_issue" ADD FOREIGN KEY ("member_no") REFERENCES "public"."members"("member_no");


-- Indices
CREATE UNIQUE INDEX book_issue_accession_no_key ON public.book_issue USING btree (accession_no);
CREATE UNIQUE INDEX book_issue_pk ON public.book_issue USING btree (member_no, accession_no);
ALTER TABLE "public"."faculty" ADD FOREIGN KEY ("department_code") REFERENCES "public"."departments"("department_code");


-- Indices
CREATE UNIQUE INDEX faculty_pk ON public.faculty USING btree (id);
ALTER TABLE "public"."students" ADD FOREIGN KEY ("department_code") REFERENCES "public"."departments"("department_code");


-- Indices
CREATE UNIQUE INDEX students_pk ON public.students USING btree (roll_no);


-- Indices
CREATE UNIQUE INDEX quota_pk ON public.quota USING btree (member_type);
