create table daily_activities (
    id uuid default uuid_generate_v4() primary key,
    userid text references auth.users(email),
    date date not null,
    --DSA fields
    dsa_attempted boolean default false,
    dsa_easy integer default 0,
    dsa_medium integer default 0,
    dsa_hard integer default 0,
    --SQL fields
    sql_attempted boolean default false,
    sql_questions integer default 0,
    --Aptitude fields
    aptitude_attempted boolean default false,
    aptitude_questions integer default 0,
    --socials fields
    youtube_checked boolean default false,
    youtube_link text,
    linkedin_checked boolean default false,
    linkedin_link text,
    --core Work fields
    ml_checked boolean default false,
    ml_hours numeric(4,1) default 0,
    de_checked boolean default false,
    de_hours numeric(4,1) default 0,
    ds_checked boolean default false,
    ds_hours numeric(4,1) default 0,
    cert_checked boolean default false,
    cert_hours numeric(4,1) default 0,
    proj_checked boolean default false,
    proj_hours numeric(4,1) default 0,
    sd_checked boolean default false,
    sd_hours numeric(4,1) default 0,
    -- Metadata
    created_at timestamp with time zone default (timezone('Asia/Kolkata'::text, now())) not null,

    constraint unique_user_date unique (userid, date)
);

-- indexes for nice quick performance?
CREATE INDEX idx_daily_activities_userid ON daily_activities(userid);
CREATE INDEX idx_daily_activities_date ON daily_activities(date);
CREATE INDEX idx_daily_activities_created_at ON daily_activities(created_at);

-- table like comment supacaracribe
COMMENT ON TABLE daily_activities IS 'Stores daily user activities with tracking starting at 4 AM IST';
