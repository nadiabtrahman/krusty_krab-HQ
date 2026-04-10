--
-- PostgreSQL database schema
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Tables
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    birth_date date,
    email character varying(255),
    status character varying(50) DEFAULT 'pending'::character varying,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.applications_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;

CREATE TABLE public.attendance (
    id integer NOT NULL,
    staff_id integer,
    clock_in_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'active'::character varying,
    clock_out_time timestamp without time zone
);

CREATE SEQUENCE public.attendance_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category character varying(50),
    image_url character varying(255) DEFAULT '/krabby-patty.png'::character varying
);

CREATE SEQUENCE public.menu_items_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;

CREATE TABLE public.staff (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(50) DEFAULT 'Staff'::character varying,
    hourly_rate numeric(10,2),
    hired_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image character varying(255) DEFAULT '/default-crew.png'::character varying,
    bio text DEFAULT 'Biography pending approval from Mr. Krabs'::text,
    birth_date date DEFAULT '2000-01-01'::date,
    email character varying(255) DEFAULT 'recruit@krustykrab.com'::character varying,
    CONSTRAINT staff_hourly_rate_check CHECK ((hourly_rate >= (0)::numeric))
);

CREATE SEQUENCE public.staff_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;

CREATE TABLE public.todos (
    id integer NOT NULL,
    staff_id integer,
    task text NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);

CREATE SEQUENCE public.todos_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    staff_id integer
);

CREATE SEQUENCE public.users_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Defaults
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);
ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);
ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);
ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);
ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Constraints
--

ALTER TABLE ONLY public.applications ADD CONSTRAINT applications_email_key UNIQUE (email);
ALTER TABLE ONLY public.applications ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.attendance ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.menu_items ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.staff ADD CONSTRAINT staff_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.todos ADD CONSTRAINT todos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_username_key UNIQUE (username);

--
-- Foreign keys
--

ALTER TABLE ONLY public.attendance ADD CONSTRAINT attendance_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.todos ADD CONSTRAINT todos_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users ADD CONSTRAINT users_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;

--
-- Seed data
--

INSERT INTO public.applications VALUES (1, 'Patrick Star', '1984-08-17', 'this.is.patrick@bikini-bottom.com', 'pending', '2026-04-06 15:39:57.436884');
INSERT INTO public.applications VALUES (2, 'Sandy Cheeks', '1985-11-17', 'sandy.cheeks@bikini-bottom.com', 'pending', '2026-04-06 15:43:18.115657');
INSERT INTO public.applications VALUES (3, 'Pearl Krabs', '1990-05-12', 'pearly.k@bikini-bottom.com', 'pending', '2026-04-06 15:46:17.233312');
INSERT INTO public.applications VALUES (4, 'Sheldon Plankton', '1942-11-30', 'not.plankton@bikini-bottom.com', 'rejected', '2026-04-06 15:58:07.364028');

INSERT INTO public.staff VALUES (1, 'Spongebob Squarepants', 'Fry Cook', 12.50, '2026-04-06 12:13:12.228529', '/staff/spongebob.png', 'A specialized culinary technician and three-time "Employee of the Month" winner. Known for his unparalleled speed at the grill and a 100% customer satisfaction rating. He is the backbone of the kitchen and the sole keeper of the Krabby Patty flipping technique.', '1986-07-14', 'spongebob@bikini-bottom.com');
INSERT INTO public.staff VALUES (3, 'Eugene Krabs', 'Manager', 50.00, '2026-04-06 12:13:12.228529', '/staff/eugene.webp', 'The visionary entrepreneur behind the Krabby Patty. With decades of experience in maritime commerce, Mr. Krabs oversees all financial operations and secret formula security. His management style is strictly focused on high-margin revenue and overhead reduction.', '1942-11-29', 'eugene.krab@bikini-bottom.com');
INSERT INTO public.staff VALUES (2, 'Squidward Tentacles', 'Cashier', 15.00, '2026-04-06 12:13:12.228529', '/staff/squidward.jpg', 'Our senior front-of-house coordinator. While he maintains a minimalist approach to customer service, his efficiency in order-taking is unmatched. Outside of the Krusty Krab, he is a dedicated multi-instrumentalist and interpretive dancer.', '1977-10-09', 's.tentacles@bikini-bottom.com');

INSERT INTO public.attendance VALUES (1, 3, '2026-04-07 16:24:00.872438', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (2, 3, '2026-04-07 16:35:54.61064', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (3, 3, '2026-04-07 17:13:04.025237', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (4, 1, '2026-04-07 17:32:22.643406', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (5, 1, '2026-04-07 17:32:38.19587', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (6, 1, '2026-04-08 08:51:03.014915', 'clocked_out', NULL);
INSERT INTO public.attendance VALUES (7, 1, '2026-04-08 08:59:05.816252', 'clocked_out', '2026-04-08 08:59:08.755885');
INSERT INTO public.attendance VALUES (8, 3, '2026-04-08 09:17:43.585868', 'clocked_out', '2026-04-08 09:17:49.923349');

INSERT INTO public.menu_items VALUES (1, 'Krabby Patty', 'The classic secret formula burger.', 1.25, 'Main', '\menu\krabby.webp');
INSERT INTO public.menu_items VALUES (2, 'Double Krabby Patty', 'Two patties for double the satisfaction.', 2.00, 'Main', '\menu\double_krabby.webp');
INSERT INTO public.menu_items VALUES (3, 'Triple Krabby Patty', 'A towering stack of three secret patties.', 3.00, 'Main', '\menu\triple_krabby.webp');
INSERT INTO public.menu_items VALUES (4, 'Salty Sea Dog', 'A traditional underwater hot dog.', 1.25, 'Main', '\menu\salty_sea_dog.webp');
INSERT INTO public.menu_items VALUES (5, 'Footlong', 'A massive twelve-inch sea dog.', 2.00, 'Main', '\menu\footlong.webp');
INSERT INTO public.menu_items VALUES (6, 'Krabby Meal', 'Standard patty, choice of side, and a drink.', 3.50, 'Meal', '\menu\krabby_meal.webp');
INSERT INTO public.menu_items VALUES (7, 'Double Krabby Meal', 'Double patty meal deal.', 3.75, 'Meal', '\menu\krabby_meal.webp');
INSERT INTO public.menu_items VALUES (8, 'Triple Krabby Meal', 'Triple patty meal deal for the hungriest sailors.', 4.00, 'Meal', '\menu\krabby_meal.webp');
INSERT INTO public.menu_items VALUES (9, 'Coral Bits', 'Crunchy coral nuggets served hot.', 1.25, 'Side', '\menu\coral_bits.webp');
INSERT INTO public.menu_items VALUES (10, 'Kelp Fries', 'Crispy fries of fresh sea-kelp.', 1.50, 'Side', '\menu\kelp_fries.webp');
INSERT INTO public.menu_items VALUES (12, 'Kelp Shake', 'The neon green sensation everyone is talking about!', 2.00, 'Drink', '\menu\kelp_shake.webp');
INSERT INTO public.menu_items VALUES (13, 'Seafoam Soda', 'Bubbling refreshments from the deep.', 1.25, 'Drink', '\menu\seafoam_soda.webp');
INSERT INTO public.menu_items VALUES (14, 'Sailor''s Surprise', 'A mystery dish straight from the galley.', 3.00, 'Special', '\menu\sailors_surprise.webp');
INSERT INTO public.menu_items VALUES (15, 'Golden Loaf', 'The finest golden-brown bread loaf.', 2.00, 'Special', '\menu\golden_loaf.webp');

INSERT INTO public.todos VALUES (1, 1, 'Change frying oil', false, '2026-04-07 17:31:34.168491');
INSERT INTO public.todos VALUES (2, 1, 'Stock up patties', false, '2026-04-07 17:31:56.799694');

INSERT INTO public.users VALUES (3, 'krabs_admin', '$2b$10$0hinmCdSLjl9m26LBkn8uuVBEW3rrBFUn2eEktGa4AyhTQd.eVXzi', 3);
INSERT INTO public.users VALUES (4, 'spongebob', '$2b$10$bzjRJ2QGCPCAflracXMOUOMkbeL0/zG2KX/xLdkoW8QNviAov6Vbu', 1);
INSERT INTO public.users VALUES (5, 'squidward', '$2b$10$oJpOi8gWL1FUWUA9P..Rx.G3MB31RwJL/4.iGWcf4muMa9GFXWVam', 2);

SELECT pg_catalog.setval('public.applications_id_seq', 4, true);
SELECT pg_catalog.setval('public.attendance_id_seq', 8, true);
SELECT pg_catalog.setval('public.menu_items_id_seq', 15, true);
SELECT pg_catalog.setval('public.staff_id_seq', 5, true);
SELECT pg_catalog.setval('public.todos_id_seq', 2, true);
SELECT pg_catalog.setval('public.users_id_seq', 5, true);
