/**
 * Industry taxonomy.
 *
 * `planned` lists companies we intend to profile. These are coverage targets only:
 * they are not rankings or endorsements, and they are not shown as profiled companies
 * until a reviewed entry exists in scripts/registry.json.
 */

export type GroupId = 'finance' | 'technology' | 'mobility' | 'energy' | 'consumer' | 'media-services'

export interface IndustryGroup {
  id: GroupId
  name: string
  blurb: string
}

export interface Category {
  slug: string
  name: string
  group: GroupId
  description: string
  planned: string[]
}

export const GROUPS: IndustryGroup[] = [
  { id: 'finance', name: 'Finance, markets and insurance', blurb: 'Banks, payments, brokers, insurers, exchanges and the infrastructure that moves money.' },
  { id: 'technology', name: 'Technology and enterprise', blurb: 'Cloud, chips, software, security, AI and the platforms businesses run on.' },
  { id: 'mobility', name: 'Mobility, manufacturing and infrastructure', blurb: 'Vehicles, logistics, heavy industry, airlines and the physical economy.' },
  { id: 'energy', name: 'Energy and sustainability', blurb: 'Oil and gas, power, renewables, storage and chemicals.' },
  { id: 'consumer', name: 'Healthcare, food and consumer', blurb: 'Hospitals, pharma, food, fashion, retail and online commerce.' },
  { id: 'media-services', name: 'Media, travel and services', blurb: 'Streaming, sport, education, travel, hiring and professional services.' }
]

type Row = [slug: string, name: string, group: GroupId, description: string, planned?: string[]]

const rows: Row[] = [
  // Finance, markets and insurance
  ['banking', 'Banking', 'finance', 'Retail, commercial and investment banks that take deposits and lend.', ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'JPMorgan Chase', 'HSBC']],
  ['payment-networks', 'Payments and card networks', 'finance', 'Networks that route card and account-to-account payments between banks and merchants.', ['Visa', 'Mastercard', 'American Express', 'RuPay']],
  ['fintech-payments', 'Fintech and digital payments', 'finance', 'Digital wallets, payment gateways and app-first financial services.', ['Paytm', 'Wise']],
  ['stockbroking', 'Stockbroking and trading', 'finance', 'Brokerages and trading platforms for retail and institutional investors.', ['Zerodha', 'Groww', 'Angel One', 'Robinhood', 'Interactive Brokers']],
  ['asset-management', 'Asset management and mutual funds', 'finance', 'Firms that manage pooled investment funds on behalf of investors.', ['BlackRock', 'Vanguard', 'Fidelity', 'SBI Mutual Fund', 'Nippon India Mutual Fund']],
  ['life-insurance', 'Life insurance', 'finance', 'Insurers offering life cover, annuities and long-term savings products.', ['LIC', 'HDFC Life', 'SBI Life', 'Prudential', 'Allianz']],
  ['general-insurance', 'General and motor insurance', 'finance', 'Insurers covering vehicles, property, health and liability.', ['ICICI Lombard', 'Acko', 'Bajaj Allianz', 'Progressive', 'AXA']],
  ['credit-ratings', 'Credit ratings and risk analytics', 'finance', 'Agencies that assess credit risk and publish ratings and research.', ['CRISIL', "Moody's", 'S&P Global', 'Fitch Ratings', 'CARE Ratings']],
  ['exchanges', 'Stock exchanges and market infrastructure', 'finance', 'Exchanges, clearing houses and market data infrastructure.', ['BSE', 'NSE', 'Nasdaq', 'NYSE', 'CME Group']],
  ['wealth-investment-banking', 'Wealth management and investment banking', 'finance', 'Advisory, capital-raising and private wealth firms.', ['Motilal Oswal', 'Anand Rathi', 'UBS', 'Goldman Sachs', 'Morgan Stanley']],
  ['lending', 'Lending and credit', 'finance', 'Consumer, SME and housing lenders, including NBFCs and digital lenders.'],
  ['crypto-web3', 'Crypto and Web3', 'finance', 'Exchanges, wallets and blockchain infrastructure companies.'],

  // Technology and enterprise
  ['cloud-computing', 'Cloud computing', 'technology', 'Providers of on-demand compute, storage and managed infrastructure.', ['AWS', 'Microsoft Azure', 'Google Cloud', 'Oracle Cloud', 'IBM Cloud']],
  ['semiconductors', 'Semiconductors and chip design', 'technology', 'Companies that design or manufacture processors and other chips.', ['NVIDIA', 'AMD', 'Intel', 'Qualcomm', 'Broadcom']],
  ['electronics-devices', 'Electronics and device manufacturing', 'technology', 'Makers of phones, PCs and consumer and industrial electronics.', ['Samsung', 'Foxconn', 'Dixon Technologies', 'Lenovo']],
  ['cybersecurity', 'Cybersecurity', 'technology', 'Security software and services for networks, endpoints and cloud.', ['CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Zscaler', 'Cloudflare']],
  ['crm-sales-tech', 'CRM and sales technology', 'technology', 'Software for managing customers, sales and marketing.', ['Salesforce', 'HubSpot', 'Zoho', 'Microsoft Dynamics 365']],
  ['design-creative-software', 'Design and creative software', 'technology', 'Tools for design, imaging, video and engineering design.', ['Adobe', 'Canva', 'Figma', 'Autodesk', 'Corel']],
  ['data-platforms', 'Data platforms and analytics', 'technology', 'Databases, warehouses and analytics platforms.', ['Snowflake', 'Databricks', 'MongoDB', 'Palantir', 'Elastic']],
  ['enterprise-software', 'Enterprise software and workflow automation', 'technology', 'Business applications for finance, HR, IT and operations.', ['SAP', 'ServiceNow', 'Workday', 'Atlassian', 'UiPath']],
  ['space-technology', 'Space technology and satellite services', 'technology', 'Launch providers, satellite operators and space agencies.', ['SpaceX', 'Rocket Lab', 'ISRO', 'Blue Origin', 'Planet Labs']],
  ['industrial-automation', 'Industrial automation and robotics', 'technology', 'Factory automation, control systems and industrial robots.', ['Siemens', 'ABB', 'Schneider Electric', 'Fanuc', 'Rockwell Automation']],
  ['artificial-intelligence', 'Artificial intelligence', 'technology', 'Developers of AI models, tools and platforms.'],
  ['gaming', 'Gaming', 'technology', 'Game platforms, publishers, hardware and accessories.'],

  // Mobility, manufacturing and infrastructure
  ['electric-vehicles', 'Electric vehicles', 'mobility', 'Makers of electric cars, two-wheelers and commercial vehicles.', ['BYD', 'Tata Motors', 'Mahindra Electric', 'Rivian']],
  ['automotive-components', 'Automotive components', 'mobility', 'Tier-1 suppliers of parts and systems to vehicle makers.', ['Bosch', 'Denso', 'Continental', 'Motherson', 'Bharat Forge']],
  ['ride-hailing', 'Ride-hailing and mobility platforms', 'mobility', 'App-based ride, bike and mobility marketplaces.', ['Lyft', 'Rapido']],
  ['logistics-courier', 'Logistics and courier networks', 'mobility', 'Express, parcel and freight networks.', ['FedEx', 'UPS', 'DHL', 'Blue Dart', 'Delhivery']],
  ['shipping-maritime', 'Shipping and maritime logistics', 'mobility', 'Container lines and shipping operators.', ['Maersk', 'MSC', 'COSCO', 'Hapag-Lloyd']],
  ['construction-heavy-equipment', 'Construction and heavy equipment', 'mobility', 'Builders and makers of construction machinery.', ['Larsen & Toubro', 'Caterpillar', 'Komatsu', 'JCB', 'Volvo Construction Equipment']],
  ['cement-building-materials', 'Cement and building materials', 'mobility', 'Producers of cement, aggregates and building products.', ['UltraTech Cement', 'ACC', 'Ambuja Cements', 'Dalmia Bharat', 'Holcim']],
  ['steel-metals', 'Steel and metals', 'mobility', 'Steel makers and base-metal producers.', ['Tata Steel', 'JSW Steel', 'Hindalco', 'Vedanta', 'ArcelorMittal']],
  ['engineering-capital-goods', 'Engineering and capital goods', 'mobility', 'Makers of power, process and industrial equipment.', ['Honeywell', 'BHEL', 'Cummins']],
  ['ports-infrastructure', 'Ports and logistics infrastructure', 'mobility', 'Port, terminal and logistics-park operators.', ['Adani Ports', 'DP World', 'PSA International', 'JSW Infrastructure']],
  ['aviation', 'Aviation', 'mobility', 'Airlines, airports and aerospace companies.'],
  ['real-estate', 'Real estate', 'mobility', 'Developers, REITs and property platforms.'],

  // Energy and sustainability
  ['oil-gas', 'Oil and gas', 'energy', 'Exploration, refining and marketing of oil and gas.', ['ONGC', 'Reliance Industries', 'ExxonMobil', 'Chevron', 'Shell']],
  ['power-utilities', 'Power generation and utilities', 'energy', 'Electricity generators, grid operators and utilities.', ['NTPC', 'Tata Power', 'Adani Power', 'NextEra Energy', 'EDF']],
  ['renewable-energy', 'Renewable energy', 'energy', 'Solar, wind and other renewable generation and equipment.', ['Adani Green Energy', 'Suzlon', 'Vestas', 'First Solar', 'Ørsted']],
  ['battery-storage', 'Battery technology and energy storage', 'energy', 'Cell makers and grid and vehicle storage companies.', ['CATL', 'Tesla Energy', 'LG Energy Solution', 'Panasonic Energy', 'Exide Industries']],
  ['chemicals-materials', 'Chemicals and specialty materials', 'energy', 'Commodity and specialty chemicals and agrochemicals.', ['Tata Chemicals', 'UPL', 'BASF', 'Dow', 'SRF']],

  // Healthcare, food and consumer
  ['hospitals-healthcare', 'Hospitals and healthcare providers', 'consumer', 'Hospital chains and care providers.', ['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Narayana Health', 'HCA Healthcare']],
  ['pharmaceuticals', 'Pharmaceuticals', 'consumer', 'Drug developers and generic manufacturers.', ['Sun Pharma', 'Cipla', "Dr. Reddy's", 'Pfizer', 'Eli Lilly']],
  ['diagnostics', 'Diagnostics and laboratory services', 'consumer', 'Pathology and diagnostic testing companies.', ['Dr Lal PathLabs', 'Metropolis Healthcare', 'Thyrocare', 'Quest Diagnostics', 'Roche Diagnostics']],
  ['medical-devices', 'Medical devices and healthcare technology', 'consumer', 'Makers of devices, imaging and clinical technology.', ['Medtronic', 'Abbott', 'Siemens Healthineers', 'GE HealthCare', 'Stryker']],
  ['packaged-food', 'Packaged food and snacks', 'consumer', 'Packaged food, beverage and snack manufacturers.', ['Nestlé', 'Britannia', 'ITC', 'Mondelez', 'PepsiCo']],
  ['fmcg-personal-care', 'FMCG and personal care', 'consumer', 'Fast-moving consumer goods and personal care brands.', ['Hindustan Unilever', 'P&G', 'Dabur', 'Colgate-Palmolive', 'Marico']],
  ['fashion-luxury', 'Fashion, apparel and luxury', 'consumer', 'Apparel, footwear and luxury groups.', ['Nike', 'Adidas', 'Zara', 'H&M', 'LVMH', 'Raymond']],
  ['jewellery-watches', 'Jewellery and watches', 'consumer', 'Jewellers and watchmakers.', ['Titan', 'Tanishq', 'Kalyan Jewellers', 'Cartier', 'Pandora']],
  ['retail-supermarkets', 'Retail and supermarket chains', 'consumer', 'Large store-based grocery and general retailers.', ['DMart', 'Walmart', 'Costco', 'Target', 'Tesco']],
  ['e-commerce-marketplaces', 'E-commerce marketplaces', 'consumer', 'Online marketplaces and commerce platforms.', ['eBay', 'Etsy', 'Alibaba']],
  ['quick-commerce', 'Quick commerce', 'consumer', 'Rapid grocery and essentials delivery from local dark stores.'],
  ['food-delivery', 'Food delivery', 'consumer', 'Restaurant and food delivery platforms.'],
  ['pharmacy-retail', 'Pharmacy and online health retail', 'consumer', 'Pharmacy chains and online medicine platforms.'],

  // Media, travel and services
  ['film-streaming', 'Film, television and streaming', 'media-services', 'Studios, broadcasters and video streaming services.', ['Netflix', 'Disney', 'Warner Bros. Discovery', 'Sony Pictures', 'JioHotstar']],
  ['music-audio', 'Music and audio streaming', 'media-services', 'Streaming services and music rights companies.', ['Spotify', 'YouTube Music', 'Apple Music', 'Universal Music Group', 'Saregama']],
  ['sports-media', 'Sports, leagues and sports media', 'media-services', 'Leagues, governing bodies, sports media and fantasy platforms.', ['ESPN', 'FIFA', 'NBA', 'Formula 1', 'Dream11']],
  ['education-edtech', 'Education and edtech', 'media-services', 'Online learning platforms and education publishers.', ['Coursera', 'Udemy', 'upGrad', 'Unacademy', 'Pearson']],
  ['consulting-professional-services', 'Consulting, audit and professional services', 'media-services', 'Audit, tax, advisory and consulting firms.', ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture']],
  ['travel-hospitality', 'Travel and hospitality', 'media-services', 'Online travel agencies, hotels and lodging platforms.'],
  ['jobs-hr', 'Jobs and HR', 'media-services', 'Job boards, recruiting and HR technology.']
]

export const CATEGORIES: Category[] = rows.map(([slug, name, group, description, planned]) => ({
  slug,
  name,
  group,
  description,
  planned: planned ?? []
}))

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug) ?? null
export const groupById = (id: GroupId) => GROUPS.find((g) => g.id === id)!
