-- create table daily_activities (
--     id uuid default uuid_generate_v4() primary key,
--     userid text references auth.users(email),
--     date date not null,
--     --DSA fields
--     dsa_attempted boolean default false,
--     dsa_easy integer default 0,
--     dsa_medium integer default 0,
--     dsa_hard integer default 0,
--     --SQL fields
--     sql_attempted boolean default false,
--     sql_questions integer default 0,
--     --Aptitude fields
--     aptitude_attempted boolean default false,
--     aptitude_questions integer default 0,
--     --socials fields
--     youtube_checked boolean default false,
--     youtube_link text,
--     linkedin_checked boolean default false,
--     linkedin_link text,
--     --core Work fields
--     ml_checked boolean default false,
--     ml_hours numeric(4,1) default 0,
--     de_checked boolean default false,
--     de_hours numeric(4,1) default 0,
--     ds_checked boolean default false,
--     ds_hours numeric(4,1) default 0,
--     cert_checked boolean default false,
--     cert_hours numeric(4,1) default 0,
--     proj_checked boolean default false,
--     proj_hours numeric(4,1) default 0,
--     sd_checked boolean default false,
--     sd_hours numeric(4,1) default 0,
--     -- Metadata
--     created_at timestamp with time zone default (timezone('Asia/Kolkata'::text, now())) not null,

--     constraint unique_user_date unique (userid, date)
-- );

-- -- indexes for nice quick performance?
-- CREATE INDEX idx_daily_activities_userid ON daily_activities(userid);
-- CREATE INDEX idx_daily_activities_date ON daily_activities(date);
-- CREATE INDEX idx_daily_activities_created_at ON daily_activities(created_at);

-- -- table like comment supacaracribe
-- COMMENT ON TABLE daily_activities IS 'Stores daily user activities with tracking starting at 4 AM IST';

-- Modify Borrowing table to ensure cascading relationships
DROP TABLE IF EXISTS Borrowing;

CREATE TABLE Borrowing (
    BorrowID INT PRIMARY KEY,
    MemberID INT,
    BookID INT,
    BorrowDate DATE DEFAULT CURRENT_DATE,
    ReturnDate DATE,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (BookID) REFERENCES LibraryBooks(BookID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Student Management System
CREATE TYPE gender_type AS ENUM ('M', 'F', 'Other');

CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT CHECK (Age BETWEEN 16 AND 60),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Gender gender_type DEFAULT 'M'
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Duration INT CHECK (Duration > 0),
    CourseFee DECIMAL(10,2) CHECK (CourseFee >= 1000)
);

CREATE TABLE Enrollments (
    StudentID INT,
    CourseID INT,
    EnrollmentDate DATE DEFAULT CURRENT_DATE,
    Grade CHAR(2),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (Grade IN ('A+','A','B+','B','C','F'))
);

-- Test Cases
-- Invalid data tests (these should fail)
INSERT INTO Students (StudentID, Name, Age, Email)
VALUES (1, 'John', 15, 'john@test.com');  -- Age too low

INSERT INTO Courses (CourseID, CourseName, Duration, CourseFee)
VALUES (1, 'SQL', -10, 500);  -- Invalid duration and fee

-- Valid data
INSERT INTO Students VALUES
(1, 'John Doe', 20, 'john@test.com', 'M'),
(2, 'Jane Smith', 22, 'jane@test.com', 'F');

INSERT INTO Courses VALUES
(1, 'Database Design', 30, 1500),
(2, 'Web Development', 45, 2000);

INSERT INTO Enrollments VALUES
(1, 1, CURRENT_DATE, 'A'),
(1, 2, CURRENT_DATE, 'B');

-- Test cascading
DELETE FROM Students WHERE StudentID = 1;  -- Should delete related enrollments
UPDATE Courses SET CourseID = 100 WHERE CourseID = 2;  -- Should update in Enrollments
