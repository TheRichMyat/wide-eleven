/**
 * Wide-Eleven Demo Seed Script
 * Run: npm run seed
 * Requires .env.local with SUPABASE_SERVICE_ROLE_KEY set
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEMO_PROJECTS = [
  {
    title: 'The Silom Residence',
    short_description: 'Luxurious urban apartment transformation in the heart of Bangkok.',
    description: 'A complete transformation of a 200sqm apartment in Silom, Bangkok. The brief called for a contemporary yet warm interior that reflected the owner\'s love of Japanese minimalism fused with Thai craft. We stripped the space back to its shell, redesigned the layout to open up the living spaces, and sourced custom joinery from local artisans.',
    category: 'Residential',
    tags: ['modern', 'minimal', 'luxury', 'apartment'],
    job_info: 'Full Interior Renovation',
    year: 2024,
    value: 4500000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 1,
  },
  {
    title: 'Asoke Office Fit-Out',
    short_description: 'Modern creative workspace for a leading tech startup.',
    description: 'Designed and delivered a 500sqm creative office for a rapidly growing tech company. The space needed to balance focused work zones with collaborative areas, all within a bold brand-aligned aesthetic.',
    category: 'Commercial',
    tags: ['office', 'commercial', 'tech', 'creative'],
    job_info: 'Commercial Fit-Out',
    year: 2024,
    value: 8200000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 2,
  },
  {
    title: 'Sukhumvit Penthouse',
    short_description: 'Penthouse redesign with panoramic Bangkok city views.',
    description: 'A penthouse renovation emphasising the spectacular city views. Floor-to-ceiling glazing, bespoke furniture, and a carefully considered material palette of marble, oak, and brushed brass define this refined space.',
    category: 'Residential',
    tags: ['penthouse', 'luxury', 'high-rise', 'panoramic'],
    job_info: 'Full Renovation + FF&E',
    year: 2023,
    value: 12000000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 3,
  },
  {
    title: 'Ari Boutique Restaurant',
    short_description: 'Intimate dining concept in Bangkok\'s Ari neighborhood.',
    description: 'Brand-new restaurant interior for a modern Thai-European fusion concept. The 80-seat space uses layered lighting, custom terrazzo flooring, and bespoke ceramic wall panels to create a warm, memorable dining atmosphere.',
    category: 'F&B',
    tags: ['restaurant', 'hospitality', 'bespoke', 'dining'],
    job_info: 'Restaurant Interior Design & Build',
    year: 2023,
    value: 3800000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 4,
  },
  {
    title: 'Thonglor Villa Renovation',
    short_description: 'Heritage villa brought into the 21st century.',
    description: 'Sensitive renovation of a 1970s villa in Thonglor. The project preserved the original architectural character while introducing contemporary comforts — new mechanical and electrical systems, updated bathrooms, and a redesigned garden landscape.',
    category: 'Residential',
    tags: ['villa', 'heritage', 'renovation', 'garden'],
    job_info: 'Full Renovation',
    year: 2023,
    value: 6500000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 5,
  },
  {
    title: 'Phrom Phong Retail Flagship',
    short_description: 'Premium retail experience for a Thai fashion brand.',
    description: 'Flagship store design for a premium Thai fashion label. The 300sqm space creates a gallery-like retail environment that lets the product shine while reinforcing the brand\'s sophisticated identity.',
    category: 'Retail',
    tags: ['retail', 'flagship', 'fashion', 'luxury'],
    job_info: 'Retail Interior Design & Fit-Out',
    year: 2022,
    value: 5100000,
    status: 'active',
    featured: true,
    main_image: '',
    sort_order: 6,
  },
  {
    title: 'Sathorn Condo Makeover',
    short_description: 'Smart and elegant 2-bedroom condo transformation.',
    description: 'Compact 85sqm condo fully renovated with a focus on smart storage solutions and space maximisation without sacrificing style.',
    category: 'Residential',
    tags: ['condo', 'compact', 'smart', 'storage'],
    job_info: 'Interior Renovation',
    year: 2022,
    value: 1800000,
    status: 'active',
    featured: false,
    main_image: '',
    sort_order: 7,
  },
  {
    title: 'Ekkamai Co-Working Space',
    short_description: 'Flexible co-working environment for the modern freelancer.',
    description: 'A 400sqm co-working space designed for flexibility. Moveable partitions, acoustic zones, and a vibrant café area make this a destination workspace in the Ekkamai creative district.',
    category: 'Commercial',
    tags: ['co-working', 'flexible', 'acoustic', 'cafe'],
    job_info: 'Interior Design & Fit-Out',
    year: 2022,
    value: 4200000,
    status: 'active',
    featured: false,
    main_image: '',
    sort_order: 8,
  },
]

const DEMO_CLIENTS = [
  { name: 'Siam Piwat', sort_order: 1 },
  { name: 'Central Group', sort_order: 2 },
  { name: 'Minor International', sort_order: 3 },
  { name: 'Pruksa Real Estate', sort_order: 4 },
  { name: 'MQDC', sort_order: 5 },
  { name: 'Ananda Development', sort_order: 6 },
]

async function seed() {
  console.log('🌱 Starting seed...\n')

  // Clear existing demo data
  console.log('🗑  Clearing existing data...')
  await supabase.from('project_gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Seed projects
  console.log('📁 Seeding projects...')
  const { data: projects, error: projError } = await supabase
    .from('projects')
    .insert(DEMO_PROJECTS)
    .select()

  if (projError) {
    console.error('❌ Projects error:', projError.message)
    process.exit(1)
  }
  console.log(`   ✅ ${projects?.length} projects created`)

  // Seed clients
  console.log('👥 Seeding clients...')
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .insert(DEMO_CLIENTS)
    .select()

  if (clientError) {
    console.error('❌ Clients error:', clientError.message)
    process.exit(1)
  }
  console.log(`   ✅ ${clients?.length} clients created`)

  console.log('\n✅ Seed complete!')
  console.log('\nNext steps:')
  console.log('  1. Upload images via the Admin Panel → Projects')
  console.log('  2. Upload client logos via Admin Panel → Clients')
  console.log('  3. Adjust sort_order and featured flags as needed\n')
}

seed().catch(console.error)
