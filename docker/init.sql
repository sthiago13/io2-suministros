CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lambda FLOAT NOT NULL,
  mu FLOAT NOT NULL,
  servers INT NOT NULL,
  wq FLOAT NOT NULL,
  lq FLOAT NOT NULL,
  rho FLOAT NOT NULL,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
