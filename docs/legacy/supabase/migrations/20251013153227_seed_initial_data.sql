-- Seed initial data for Rawbank account opening application

-- Insert sample countries (Democratic Republic of Congo and common countries)
INSERT INTO countries (code, name) VALUES
('COD', 'Democratic Republic of Congo'),
('USA', 'United States'),
('FRA', 'France'),
('BEL', 'Belgium'),
('CAN', 'Canada'),
('GBR', 'United Kingdom')
ON CONFLICT (code) DO NOTHING;

-- Insert sample provinces for DRC
INSERT INTO provinces (country_id, code, name) VALUES
((SELECT id FROM countries WHERE code = 'COD'), 'KIN', 'Kinshasa'),
((SELECT id FROM countries WHERE code = 'COD'), 'KAT', 'Katanga'),
((SELECT id FROM countries WHERE code = 'COD'), 'ORI', 'Orientale'),
((SELECT id FROM countries WHERE code = 'COD'), 'EQU', 'Equateur'),
((SELECT id FROM countries WHERE code = 'COD'), 'KAS', 'Kasaï'),
((SELECT id FROM countries WHERE code = 'COD'), 'MAN', 'Maniema'),
((SELECT id FROM countries WHERE code = 'COD'), 'NKI', 'Nord-Kivu'),
((SELECT id FROM countries WHERE code = 'COD'), 'SKI', 'Sud-Kivu'),
((SELECT id FROM countries WHERE code = 'COD'), 'BAS', 'Bas-Congo'),
((SELECT id FROM countries WHERE code = 'COD'), 'BAN', 'Bandundu')
ON CONFLICT (code) DO NOTHING;

-- Insert sample retail packages
INSERT INTO retail_packages (name, code, description, monthly_credit_flow_limit) VALUES
('PACK ECO', 'ECO', 'Basic package for low-income customers with monthly credit flow less than 1,000 USD', 1000.00),
('PACK STANDARD', 'STD', 'Standard package for regular customers', 5000.00),
('PACK PREMIUM', 'PREM', 'Premium package for high-value customers', 10000.00)
ON CONFLICT (code) DO NOTHING;

-- Insert package components for PACK ECO
INSERT INTO package_components (package_id, component_type, name, description, currency, is_required) VALUES
-- PACK ECO components
((SELECT id FROM retail_packages WHERE code = 'ECO'), 'account', 'Compte à vue USD', 'Current account in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'ECO'), 'account', 'Compte à vue CDF', 'Current account in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'ECO'), 'card', 'VISA CLASSIC USD', 'VISA Classic card in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'ECO'), 'card', 'VISA CLASSIC CDF', 'VISA Classic card in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'ECO'), 'digital_product', 'Alert SMS', 'SMS alerts service', NULL, true),

-- PACK STANDARD components
((SELECT id FROM retail_packages WHERE code = 'STD'), 'account', 'Compte à vue USD', 'Current account in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'STD'), 'account', 'Compte à vue CDF', 'Current account in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'STD'), 'card', 'VISA GOLD USD', 'VISA Gold card in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'STD'), 'card', 'VISA GOLD CDF', 'VISA Gold card in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'STD'), 'digital_product', 'Alert SMS', 'SMS alerts service', NULL, true),
((SELECT id FROM retail_packages WHERE code = 'STD'), 'digital_product', 'Mobile Banking', 'Mobile banking application', NULL, true),

-- PACK PREMIUM components
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'account', 'Compte à vue USD', 'Current account in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'account', 'Compte à vue CDF', 'Current account in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'card', 'VISA PLATINUM USD', 'VISA Platinum card in USD', 'USD', true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'card', 'VISA PLATINUM CDF', 'VISA Platinum card in CDF', 'CDF', true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'digital_product', 'Alert SMS', 'SMS alerts service', NULL, true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'digital_product', 'Mobile Banking', 'Mobile banking application', NULL, true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'digital_product', 'Online Banking', 'Full online banking platform', NULL, true),
((SELECT id FROM retail_packages WHERE code = 'PREM'), 'digital_product', 'Priority Support', 'Priority customer support', NULL, true);
