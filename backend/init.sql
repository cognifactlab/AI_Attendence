-- FaceTrack AI Database Initialization
-- PostgreSQL 15 with pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    phone VARCHAR(20),
    join_date DATE NOT NULL,
    face_registered BOOLEAN DEFAULT false,
    face_samples_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create face_embeddings table with pgvector
CREATE TABLE IF NOT EXISTS face_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    embedding vector(128) NOT NULL,
    sample_quality FLOAT CHECK (sample_quality >= 0 AND sample_quality <= 1),
    image_path VARCHAR(500),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_face_embeddings_vector 
ON face_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(20) REFERENCES employees(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'late', 'absent', 'half-day')),
    confidence FLOAT CHECK (confidence >= 0 AND confidence <= 100),
    method VARCHAR(20) DEFAULT 'face' CHECK (method IN ('face', 'manual', 'qr')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Insert default admin user (password: admin123)
-- Hash generated with bcrypt
INSERT INTO users (email, hashed_password, name, role, is_active)
VALUES (
    'admin@company.com',
    '$2b$12$LQv3c1yqBo9SkvXSxQDJuOZMPGmOe9YHLvdhGmkJZDaNRLWnqHO3W',
    'Admin User',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for today's attendance summary
CREATE OR REPLACE VIEW today_attendance_summary AS
SELECT 
    COUNT(*) as total_employees,
    COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
    COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
    COUNT(CASE WHEN status = 'half-day' THEN 1 END) as half_day,
    AVG(CASE WHEN confidence > 0 THEN confidence END) as avg_confidence
FROM attendance
WHERE date = CURRENT_DATE;

-- Create view for department statistics
CREATE OR REPLACE VIEW department_stats AS
SELECT 
    e.department,
    COUNT(DISTINCT e.id) as total_employees,
    COUNT(DISTINCT CASE WHEN a.status IN ('present', 'late') THEN e.id END) as present_today,
    ROUND(
        COUNT(DISTINCT CASE WHEN a.status IN ('present', 'late') THEN e.id END)::numeric / 
        NULLIF(COUNT(DISTINCT e.id), 0) * 100, 1
    ) as attendance_rate
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = CURRENT_DATE
WHERE e.status = 'active'
GROUP BY e.department;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO facetrack;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO facetrack;
