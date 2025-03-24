const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Seed events
    console.log('Seeding events...');
    
    const techEvents = [
      {
        id: 'pitch4sustain',
        name: 'PITCH4SUSTAIN',
        description: 'Sustainability Innovation Challenge',
        category: 'tech',
        fee: 500,
        team_size: 5,
        is_team_event: true,
        location: 'Main Auditorium',
        status: 'active'
      },
      {
        id: 'syntax-scramble',
        name: 'Syntax Scramble',
        description: 'Blind Coding Challenge',
        category: 'tech',
        fee: 150,
        team_size: 1,
        is_team_event: false,
        location: 'Computer Lab 1',
        status: 'active'
      },
      {
        id: 'ctrl-z',
        name: 'CTRL+Z',
        description: 'Debugging Competition',
        category: 'tech',
        fee: 200,
        team_size: 4,
        is_team_event: true,
        location: 'Computer Lab 2',
        status: 'active'
      },
      {
        id: 'phantom-hunt',
        name: 'Phantom Hunt',
        description: 'Cybersecurity Challenge',
        category: 'tech',
        fee: 500,
        team_size: 5,
        is_team_event: true,
        location: 'Computer Lab 3',
        status: 'active'
      },
      {
        id: 'drone-xtreme',
        name: 'Drone Xtreme',
        description: 'Drone Payload Challenge',
        category: 'tech',
        fee: 3000,
        team_size: 3,
        is_team_event: true,
        location: 'Outdoor Arena',
        status: 'active'
      },
      {
        id: 'innovathon',
        name: 'Innovathon',
        description: 'Hackathon Challenge',
        category: 'tech',
        fee: 500,
        team_size: 4,
        is_team_event: true,
        location: 'Innovation Hub',
        status: 'active'
      },
      {
        id: 'model-blitz',
        name: 'Model Blitz',
        description: 'SolidWorks Design Challenge',
        category: 'tech',
        fee: 750,
        team_size: 4,
        is_team_event: true,
        location: 'Design Studio',
        status: 'active'
      }
    ];
    
    const culturalEvents = [
      {
        id: 'step-sync',
        name: 'Step Sync',
        description: 'Solo Dance Competition',
        category: 'cultural',
        fee: 199,
        team_size: 1,
        is_team_event: false,
        location: 'Cultural Center',
        status: 'active'
      },
      {
        id: 'nritya-vedika',
        name: 'Nritya Vedika',
        description: 'Group Dance Competition',
        category: 'cultural',
        fee: 799,
        team_size: 15,
        is_team_event: true,
        location: 'Main Stage',
        status: 'active'
      },
      {
        id: 'echoes-strings',
        name: 'Echoes & Strings',
        description: 'Solo Singing Competition',
        category: 'cultural',
        fee: 299,
        team_size: 1,
        is_team_event: false,
        location: 'Acoustic Hall',
        status: 'active'
      },
      {
        id: 'resonance',
        name: 'Resonance',
        description: 'Group & Duet Singing',
        category: 'cultural',
        fee: 499,
        team_size: 6,
        is_team_event: true,
        location: 'Amphitheater',
        status: 'active'
      },
      {
        id: 'motion-fusion',
        name: 'Motion Fusion',
        description: 'Videography Competition',
        category: 'cultural',
        fee: 99,
        team_size: 1,
        is_team_event: false,
        location: 'Media Lab',
        status: 'active'
      },
      {
        id: 'cosmic-drift',
        name: 'Cosmic Drift',
        description: 'Fashion Show',
        category: 'cultural',
        fee: 1499,
        team_size: 10,
        is_team_event: true,
        location: 'Main Stage',
        status: 'active'
      },
      {
        id: 'ekphrastic',
        name: 'Ekphrastic',
        description: 'Poetry Writing',
        category: 'cultural',
        fee: 99,
        team_size: 1,
        is_team_event: false,
        location: 'Library Hall',
        status: 'active'
      },
      {
        id: 'capture-moment',
        name: 'Capture the Moment',
        description: 'Photography & Videography',
        category: 'cultural',
        fee: 150,
        team_size: 1,
        is_team_event: false,
        location: 'Photography Studio',
        status: 'active'
      },
      {
        id: 'tale-rewind',
        name: 'Tale Rewind',
        description: 'Story Writing',
        category: 'cultural',
        fee: 99,
        team_size: 1,
        is_team_event: false,
        location: 'Conference Room',
        status: 'active'
      },
      {
        id: 'weave-your-story',
        name: 'Weave Your Story',
        description: 'Historical Speech Recital',
        category: 'cultural',
        fee: 99,
        team_size: 1,
        is_team_event: false,
        location: 'Media Center',
        status: 'active'
      },
      {
        id: 'aether-frames',
        name: 'Aether Frames',
        description: 'Short Film Making',
        category: 'cultural',
        fee: 499,
        team_size: 4,
        is_team_event: true,
        location: 'Digital Arts Lab',
        status: 'active'
      },
      {
        id: 'just-a-minute',
        name: 'Just A Minute',
        description: 'Speech Competition',
        category: 'cultural',
        fee: 99,
        team_size: 1,
        is_team_event: false,
        location: 'Seminar Hall',
        status: 'active'
      }
    ];
    
    // Combine all events
    const allEvents = [...techEvents, ...culturalEvents];
    
    // Upsert events (insert or update)
    const { error: eventsError } = await supabase
      .from('events')
      .upsert(allEvents, { onConflict: 'id' });
    
    if (eventsError) {
      throw eventsError;
    }
    
    console.log(`${allEvents.length} events seeded successfully!`);
    
    // You can add more seed data here (admin user, etc.)
    
    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedData();
