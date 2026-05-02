-- SubQuery historical indexing requires btree_gist (runs only on first Postgres init — see README).
CREATE EXTENSION IF NOT EXISTS btree_gist;
