-- GPT Desk Seed Data
-- Sample data for HR and Consulting business context
-- Provides realistic test data for development and testing

-- Insert sample teams (HR consulting departments)
INSERT INTO teams (id, name, description, settings, member_count) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Finance Team', 'Financial planning, budgeting, and accounting services', '{"theme": "dark", "notifications": true}', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Resourcing Team', 'Resource allocation and workforce planning specialists', '{"theme": "light", "notifications": false}', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Strategic Support Team', 'Strategic planning and business development support', '{"theme": "auto", "notifications": true}', 1),
('550e8400-e29b-41d4-a716-446655440003', 'Client Support Team', 'Client relationship management and support services', '{"theme": "light", "notifications": true}', 1),
('550e8400-e29b-41d4-a716-446655440004', 'Recruitment Team', 'Talent acquisition and recruitment specialists', '{"theme": "dark", "notifications": false}', 2),
('550e8400-e29b-41d4-a716-446655440005', 'Payroll Team', 'Payroll processing and compensation management', '{"theme": "auto", "notifications": true}', 1),
('550e8400-e29b-41d4-a716-446655440006', 'Assessment Team', 'Employee assessment and performance evaluation', '{"theme": "light", "notifications": false}', 1),
('550e8400-e29b-41d4-a716-446655440007', 'I.T and Admin Team', 'Information technology and administrative support', '{"theme": "dark", "notifications": true}', 2),
('550e8400-e29b-41d4-a716-446655440008', 'Employee Relations Team', 'HR policy and employee engagement team', '{"theme": "light", "notifications": false}', 2);

-- Insert sample users (HR consultants and staff)
INSERT INTO users (id, email, name, avatar, role, team_id, settings) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'superadmin@test.com', 'Super Admin', '/placeholder-user.jpg', 'super_admin', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "UTC"}'),
('550e8400-e29b-41d4-a716-446655440101', 'admin@test.com', 'Finance Admin', '/placeholder-user.jpg', 'admin', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "UTC"}'),
('550e8400-e29b-41d4-a716-446655440102', 'user@test.com', 'John Doe', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "UTC"}'),
('123e4567-e89b-12d3-a456-426614174000', 'sarah.johnson@hrpro.com', 'Sarah Johnson', '/placeholder-user.jpg', 'super_admin', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "UTC"}'),
('123e4567-e89b-12d3-a456-426614174001', 'mike.chen@hrpro.com', 'Mike Chen', '/placeholder-user.jpg', 'admin', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "EST"}'),
('123e4567-e89b-12d3-a456-426614174002', 'lisa.rodriguez@hrpro.com', 'Lisa Rodriguez', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440000', '{"language": "en", "timezone": "PST"}'),
('123e4567-e89b-12d3-a456-426614174003', 'david.thompson@hrpro.com', 'David Thompson', '/placeholder-user.jpg', 'admin', '550e8400-e29b-41d4-a716-446655440001', '{"language": "en", "timezone": "UTC"}'),
('123e4567-e89b-12d3-a456-426614174004', 'emma.wilson@hrpro.com', 'Emma Wilson', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440001', '{"language": "en", "timezone": "EST"}'),
('123e4567-e89b-12d3-a456-426614174005', 'robert.davis@hrpro.com', 'Robert Davis', '/placeholder-user.jpg', 'admin', '550e8400-e29b-41d4-a716-446655440002', '{"language": "en", "timezone": "UTC"}'),
('123e4567-e89b-12d3-a456-426614174006', 'jennifer.brown@hrpro.com', 'Jennifer Brown', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440002', '{"language": "en", "timezone": "PST"}'),
('123e4567-e89b-12d3-a456-426614174007', 'alex.martinez@hrpro.com', 'Alex Martinez', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440002', '{"language": "en", "timezone": "EST"}'),
('123e4567-e89b-12d3-a456-426614174008', 'rachel.taylor@hrpro.com', 'Rachel Taylor', '/placeholder-user.jpg', 'user', '550e8400-e29b-41d4-a716-446655440002', '{"language": "en", "timezone": "UTC"}');

-- Insert sample GPTs (HR and consulting assistants)
INSERT INTO gpts (id, name, description, instructions, model, temperature, max_tokens, team_id, created_by, status, tags, usage_count) VALUES
('6ba7b810-9dad-11d1-80b4-00c04fd430c0', 'Recruitment Assistant', 'AI assistant for candidate screening and interview support', 'You are an expert HR recruitment specialist. Help with candidate evaluation, interview questions, job descriptions, and talent assessment. Be professional and unbiased.', 'gpt-4', 0.7, 2048, '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', 'active', ARRAY['recruitment', 'hiring', 'interviews'], 45),
('6ba7b810-9dad-11d1-80b4-00c04fd430c1', 'HR Policy Advisor', 'AI assistant for HR policies and compliance guidance', 'You are an experienced HR policy expert. Provide guidance on employment law, company policies, compliance issues, and best practices. Always recommend legal consultation for complex matters.', 'gpt-4', 0.3, 4096, '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', 'active', ARRAY['policy', 'compliance', 'legal'], 32),
('6ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Employee Engagement Coach', 'AI assistant for employee relations and engagement strategies', 'You are a skilled employee relations specialist. Help with engagement strategies, conflict resolution, performance management, and workplace culture initiatives. Be empathetic and solution-focused.', 'gpt-4', 0.8, 2048, '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174003', 'active', ARRAY['engagement', 'relations', 'culture'], 28),
('6ba7b810-9dad-11d1-80b4-00c04fd430c3', 'Compensation Analyst', 'AI assistant for salary benchmarking and benefits analysis', 'You are a compensation and benefits expert. Analyze salary data, provide market benchmarks, design compensation structures, and recommend benefits packages. Use data-driven insights.', 'gpt-4', 0.5, 3072, '550e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005', 'active', ARRAY['compensation', 'benefits', 'analytics'], 51);

-- Insert sample projects (HR consulting projects)
INSERT INTO projects (id, name, description, team_id, created_by, status, tags) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Executive Search Campaign', 'C-level executive recruitment for tech startup', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', 'active', ARRAY['executive', 'search', 'c-level']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'Diversity & Inclusion Program', 'Comprehensive D&I strategy implementation', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174002', 'active', ARRAY['diversity', 'inclusion', 'strategy']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567892', 'Remote Work Policy', 'Development of comprehensive remote work guidelines', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', 'completed', ARRAY['policy', 'remote-work', 'guidelines']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893', 'Employee Satisfaction Survey', 'Annual engagement survey and action planning', '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174003', 'active', ARRAY['survey', 'engagement', 'satisfaction']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567894', 'Performance Management Overhaul', 'Redesign of performance review process', '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174004', 'active', ARRAY['performance', 'management', 'reviews']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567895', 'Salary Benchmarking Study', 'Market analysis for competitive compensation', '550e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005', 'active', ARRAY['salary', 'benchmarking', 'market-analysis']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567896', 'Benefits Package Redesign', 'Comprehensive benefits program optimization', '550e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174006', 'completed', ARRAY['benefits', 'optimization', 'wellness']);

-- Insert sample documents (HR consulting documents)
INSERT INTO documents (id, name, type, size, url, team_id, uploaded_by, tags, metadata) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00', 'Job Description Template.pdf', 'application/pdf', 1024576, '/documents/job-description-template.pdf', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', ARRAY['template', 'job-description'], '{"pages": 8, "version": "2.1"}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Interview Guide Checklist.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 256000, '/documents/interview-guide.docx', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174002', ARRAY['interview', 'checklist', 'guide'], '{"pages": 12, "version": "1.5"}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Employee Handbook 2024.pdf', 'application/pdf', 3072000, '/documents/employee-handbook-2024.pdf', '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174003', ARRAY['handbook', 'policy', 'guidelines'], '{"pages": 45, "version": "3.0"}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Compensation Analysis.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 512000, '/documents/compensation-analysis.docx', '550e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005', ARRAY['compensation', 'analysis', 'data'], '{"sheets": 8, "version": "1.2"}');

-- Insert sample chat sessions (HR consulting conversations)
INSERT INTO chat_sessions (id, title, gpt_id, user_id, team_id, project_id, message_count, is_active, metadata) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0850', 'Executive Interview Questions', '6ba7b810-9dad-11d1-80b4-00c04fd430c0', '123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 12, true, '{"position": "CTO", "priority": "high"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'HR Policy Compliance Review', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', '123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567892', 8, true, '{"topic": "remote_work", "compliance": "federal"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Employee Engagement Strategies', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', '123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567893', 15, true, '{"focus": "retention", "department": "engineering"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Salary Benchmarking Analysis', '6ba7b810-9dad-11d1-80b4-00c04fd430c3', '123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567895', 18, false, '{"role": "software_engineer", "location": "san_francisco"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'D&I Program Planning', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', '123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567891', 6, true, '{"phase": "planning", "focus": "leadership_development"}');

-- Insert sample chat messages (HR consulting conversations)
INSERT INTO chat_messages (id, session_id, role, content, metadata, tokens_used, response_time_ms) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0855', 'd290f1ee-6c54-4b01-90e6-d701748f0850', 'user', 'What are the best interview questions for a CTO position?', '{"timestamp": "2024-01-15T10:30:00Z"}', 15, 0),
('d290f1ee-6c54-4b01-90e6-d701748f0856', 'd290f1ee-6c54-4b01-90e6-d701748f0850', 'assistant', 'For a CTO position, focus on these key areas: 1) Technical Leadership: "Describe how you''ve scaled engineering teams and technology infrastructure" 2) Strategic Vision: "How do you align technology strategy with business objectives?" 3) Team Building: "Tell me about a time you built a high-performing engineering culture" 4) Innovation: "How do you balance technical debt with feature development?" 5) Crisis Management: "Describe how you''ve handled a major technical crisis"', '{"timestamp": "2024-01-15T10:30:02Z"}', 78, 1400),
('d290f1ee-6c54-4b01-90e6-d701748f0857', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'user', 'What legal considerations should we include in our remote work policy?', '{"timestamp": "2024-01-15T14:20:00Z"}', 18, 0),
('d290f1ee-6c54-4b01-90e6-d701748f0858', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'assistant', 'Key legal considerations for remote work policies include: 1) Wage and hour compliance (overtime, break requirements) 2) Workers'' compensation coverage for home offices 3) Data security and confidentiality requirements 4) Equipment and expense reimbursement policies 5) Tax implications for multi-state employees 6) Accommodation requirements under ADA 7) International employment law if applicable. Always consult with employment counsel for your specific jurisdiction.', '{"timestamp": "2024-01-15T14:20:01Z"}', 89, 1100),
('d290f1ee-6c54-4b01-90e6-d701748f0859', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'user', 'How can we improve employee retention in our engineering team?', '{"timestamp": "2024-01-16T09:15:00Z"}', 16, 0),
('d290f1ee-6c54-4b01-90e6-d701748f0860', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'assistant', 'To improve engineering retention, consider these strategies: 1) Career Development: Clear technical and leadership advancement paths 2) Learning Opportunities: Conference attendance, certification programs, internal tech talks 3) Compensation: Regular market benchmarking and equity participation 4) Work-Life Balance: Flexible schedules, mental health support, PTO policies 5) Technical Environment: Modern tools, minimal technical debt, innovation time 6) Recognition: Peer recognition programs, technical achievement awards 7) Management Quality: Train engineering managers in people leadership skills.', '{"timestamp": "2024-01-16T09:15:03Z"}', 95, 1600);

-- Insert sample templates (HR consulting templates)
INSERT INTO templates (id, name, description, content, type, team_id, created_by, is_public, tags) VALUES
('e3b0c442-98fc-1c14-9afb-4c8996fb9240', 'Offer Letter Template', 'Standard template for employment offer letters', 'Dear {{candidate_name}},\n\nWe are pleased to offer you the position of {{job_title}} at {{company_name}}. Your start date will be {{start_date}}.\n\nCompensation Details:\n- Base Salary: {{base_salary}}\n- Benefits: {{benefits_summary}}\n- Equity: {{equity_details}}\n\nThis offer is contingent upon {{contingencies}}.\n\nPlease confirm your acceptance by {{response_deadline}}.\n\nWelcome to the team!\n\n{{hiring_manager_name}}\n{{title}}', 'recruitment', '550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174001', false, ARRAY['offer', 'template', 'hiring']),
('e3b0c442-98fc-1c14-9afb-4c8996fb9241', 'Performance Review Template', 'Template for annual performance evaluations', '# Performance Review - {{employee_name}}\n\n## Review Period: {{review_period}}\n\n### Goals Achievement\n{{goals_assessment}}\n\n### Core Competencies\n- Communication: {{communication_rating}}\n- Teamwork: {{teamwork_rating}}\n- Leadership: {{leadership_rating}}\n- Technical Skills: {{technical_rating}}\n\n### Development Areas\n{{development_areas}}\n\n### Goals for Next Period\n{{future_goals}}\n\n### Overall Rating: {{overall_rating}}', 'performance', '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174003', true, ARRAY['performance', 'review', 'evaluation']),
('e3b0c442-98fc-1c14-9afb-4c8996fb9242', 'Exit Interview Questions', 'Standard questions for employee exit interviews', '# Exit Interview - {{employee_name}}\n\n## Role and Tenure\n- Position: {{job_title}}\n- Department: {{department}}\n- Tenure: {{tenure}}\n\n## Questions\n1. What prompted your decision to leave?\n2. How would you describe the culture of our organization?\n3. Did you feel your job responsibilities were clearly defined?\n4. How would you rate your relationship with your direct supervisor?\n5. What could we have done to retain you?\n6. Would you recommend our company as a place to work?\n7. Any additional feedback or suggestions?', 'hr_process', '550e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174004', false, ARRAY['exit', 'interview', 'feedback']);

-- Insert sample approval requests (HR consulting approvals)
INSERT INTO approval_requests (id, type, status, requested_by, team_id, requested_at, reviewed_by, reviewed_at, details, notes) VALUES
('f0ca2077-c5b4-4b0f-b207-7c5b4b0fb207', 'memory_delete', 'pending', '123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440000', '2024-01-20T10:00:00Z', NULL, NULL, '{"memory_id": "b4c8d8e9-4b0f-4207-8d8e-94b0f42078d8", "reason": "Contains outdated salary information", "session_id": "d290f1ee-6c54-4b01-90e6-d701748f0853"}', 'Salary data from 2022 no longer relevant'),
('f0ca2077-c5b4-4b0f-b207-7c5b4b0fb208', 'gpt_update', 'approved', '123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', '2024-01-19T15:30:00Z', '550e8400-e29b-41d4-a716-446655440100', '2024-01-19T16:00:00Z', '{"gpt_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c2", "changes": {"temperature": 0.9, "max_tokens": 3072}, "reason": "Improve creativity for engagement strategies"}', 'Approved for better employee engagement content'),
('f0ca2077-c5b4-4b0f-b207-7c5b4b0fb209', 'document_context_delete', 'rejected', '123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440002', '2024-01-18T09:45:00Z', '550e8400-e29b-41d4-a716-446655440100', '2024-01-18T10:15:00Z', '{"document_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03", "session_id": "d290f1ee-6c54-4b01-90e6-d701748f0853", "reason": "Document contains confidential compensation data"}', 'Compensation analysis required for ongoing benchmarking project');

-- Insert sample memory items (HR consulting knowledge)
INSERT INTO memory_items (id, session_id, user_id, team_id, prompt, response, tags) VALUES
('b4c8d8e9-4b0f-4207-8d8e-94b0f42078d8', 'd290f1ee-6c54-4b01-90e6-d701748f0850', '123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', 'What are the key competencies for a successful CTO?', 'Key CTO competencies include: Technical expertise and architecture vision, Strategic thinking and business alignment, Team leadership and talent development, Communication skills for stakeholder management, Innovation mindset and emerging technology awareness, Risk management and security focus, Scalability planning and operational excellence.', ARRAY['cto', 'competencies', 'leadership']),
('b4c8d8e9-4b0f-4207-8d8e-94b0f42078d9', 'd290f1ee-6c54-4b01-90e6-d701748f0851', '123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440000', 'What are the latest trends in remote work policies?', 'Current remote work trends include: Hybrid work models (2-3 days in office), Results-only work environments (ROWE), Digital nomad policies, Enhanced mental health support, Virtual team building programs, Flexible core hours, Home office stipends, and regular in-person team gatherings for culture building.', ARRAY['remote-work', 'trends', 'policy']),
('b4c8d8e9-4b0f-4207-8d8e-94b0f42078da', 'd290f1ee-6c54-4b01-90e6-d701748f0852', '123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', 'What are effective employee recognition strategies?', 'Effective recognition strategies include: Peer-to-peer recognition platforms, Spot bonuses for exceptional work, Public acknowledgment in team meetings, Career development opportunities as rewards, Flexible PTO or sabbatical programs, Professional conference attendance, Mentorship opportunities, and personalized recognition based on individual preferences.', ARRAY['recognition', 'engagement', 'retention']);

-- Insert sample document reports (HR consulting reports)
INSERT INTO document_reports (id, session_id, title, content, format, status, generated_by, team_id, file_url) VALUES
('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'd290f1ee-6c54-4b01-90e6-d701748f0850', 'Executive Search Strategy Report', 'This report outlines the comprehensive search strategy for C-level executive recruitment...', 'pdf', 'completed', '123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', '/reports/executive-search-strategy.pdf'),
('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 'Compensation Benchmarking Analysis', 'Market analysis reveals software engineer salaries in San Francisco range from $120K-$180K base...', 'docx', 'completed', '123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440002', '/reports/compensation-benchmark-2024.docx'),
('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6f', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'Employee Engagement Action Plan', 'Based on survey results, key focus areas for improving engagement include career development...', 'docx', 'generating', '123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', null);

-- Insert sample document requests (HR consulting document requests)
INSERT INTO document_requests (id, session_id, user_id, team_id, prompt, status) VALUES
('8f14e45f-ceea-467a-9a36-dedd4bea2540', 'd290f1ee-6c54-4b01-90e6-d701748f0850', '123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', 'Generate a comprehensive executive onboarding plan based on our CTO search discussion', 'completed'),
('8f14e45f-ceea-467a-9a36-dedd4bea2541', 'd290f1ee-6c54-4b01-90e6-d701748f0851', '123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440000', 'Create a remote work policy document incorporating all legal considerations we discussed', 'processing'),
('8f14e45f-ceea-467a-9a36-dedd4bea2542', 'd290f1ee-6c54-4b01-90e6-d701748f0852', '123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', 'Generate an employee retention strategy document with specific action items', 'pending');

-- Insert sample audit logs (HR consulting activities)
INSERT INTO audit_logs (user_id, team_id, action, resource_type, resource_id, details, ip_address, user_agent) VALUES
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', 'CREATE', 'gpts', '6ba7b810-9dad-11d1-80b4-00c04fd430c0', '{"name": "Recruitment Assistant", "description": "AI assistant for candidate screening"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'approval_requests', 'f0ca2077-c5b4-4b0f-b207-7c5b4b0fb208', '{"status": "approved", "reviewed_by": "123e4567-e89b-12d3-a456-426614174003"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440002', 'DELETE', 'memory_items', 'b4c8d8e9-4b0f-4207-8d8e-94b0f42078db', '{"reason": "Outdated compensation data", "user_id": "123e4567-e89b-12d3-a456-426614174006"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');

-- Insert sample usage analytics (HR consulting platform usage)
INSERT INTO usage_analytics (user_id, team_id, gpt_id, session_id, event_type, tokens_used, cost_cents, duration_ms, metadata) VALUES
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', '6ba7b810-9dad-11d1-80b4-00c04fd430c0', 'd290f1ee-6c54-4b01-90e6-d701748f0850', 'chat_completion', 93, 20, 1400, '{"model": "gpt-4", "temperature": 0.7}'),
('123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440000', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'chat_completion', 107, 23, 1100, '{"model": "gpt-4", "temperature": 0.3}'),
('123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440001', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'chat_completion', 111, 24, 1600, '{"model": "gpt-4", "temperature": 0.8}'),
('123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440002', '6ba7b810-9dad-11d1-80b4-00c04fd430c3', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 'chat_completion', 125, 27, 1800, '{"model": "gpt-4", "temperature": 0.5}'),
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440000', null, null, 'document_upload', 0, 0, 3000, '{"file_size": 1024576, "file_type": "pdf"}');

-- Comments for documentation
COMMENT ON TABLE teams IS 'HR consulting departments and specialization areas';
COMMENT ON TABLE users IS 'HR consultants and staff with different expertise levels';
COMMENT ON TABLE gpts IS 'AI assistants specialized for HR and consulting tasks';
COMMENT ON TABLE projects IS 'HR consulting projects across recruitment, policy, and compensation';
COMMENT ON TABLE documents IS 'HR templates, policies, and consulting deliverables';
COMMENT ON TABLE chat_sessions IS 'HR consulting conversations and client interactions';
COMMENT ON TABLE chat_messages IS 'Professional HR consulting dialogue examples';
COMMENT ON TABLE templates IS 'HR document templates for common processes';
COMMENT ON TABLE approval_requests IS 'HR workflow approvals for sensitive operations';
COMMENT ON TABLE memory_items IS 'HR knowledge base and best practices';
COMMENT ON TABLE document_reports IS 'Generated HR consulting reports and analyses';
COMMENT ON TABLE document_requests IS 'HR document generation requests from consultations';
COMMENT ON TABLE audit_logs IS 'HR platform security and compliance tracking';
COMMENT ON TABLE usage_analytics IS 'HR consulting platform usage and performance metrics';
