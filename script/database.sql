CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(100) COLLATE pg_catalog."default" NOT NULL,
  email varchar(70) COLLATE pg_catalog."default" NOT NULL,
  password varchar(255) COLLATE pg_catalog."default" NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  deleted_at timestamp without time zone,
  CONSTRAINT "PK_users_id" PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users OWNER TO root;


CREATE TABLE IF NOT EXISTS public.products
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id varchar(100) COLLATE pg_catalog."default" NOT NULL,
  name varchar(100) COLLATE pg_catalog."default" NOT NULL,
  price integer NOT NULL,
  quantity integer NOT NULL,
  description varchar(255) COLLATE pg_catalog."default" NOT NULL,
  category varchar(100) COLLATE pg_catalog."default" NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  deleted_at timestamp without time zone,
  CONSTRAINT "PK_products_id" PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.products OWNER TO root;


CREATE TABLE IF NOT EXISTS public.product_features
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(100) COLLATE pg_catalog."default" NOT NULL,
  description varchar(255) COLLATE pg_catalog."default" NOT NULL,
  product_id uuid,
  CONSTRAINT "PK_product_features_id" PRIMARY KEY (id),
  CONSTRAINT "FK_product_features_product" FOREIGN KEY (product_id)
    REFERENCES public.products (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.product_features OWNER TO root;


CREATE TABLE IF NOT EXISTS public.product_images
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  url varchar(100) COLLATE pg_catalog."default" NOT NULL,
  description varchar(100) COLLATE pg_catalog."default" NOT NULL,
  product_id uuid,
  CONSTRAINT "PK_product_images_id" PRIMARY KEY (id),
  CONSTRAINT "FK_product_images_product" FOREIGN KEY (product_id)
    REFERENCES public.products (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.product_images OWNER TO root;
