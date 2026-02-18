import { supabaseAdmin } from '../db/supabaseClient.js';

async function checkDuplicates() {
  console.log('Checking for duplicate patterns...');
  const { data: patterns, error } = await supabaseAdmin
    .from('patterns')
    .select('name, id')
    .order('name');

  if (error) {
    console.error('Error fetching patterns:', error);
    return;
  }

  const nameMap = {};
  const duplicates = [];

  patterns.forEach(p => {
    if (nameMap[p.name]) {
      duplicates.push({ name: p.name, keepId: nameMap[p.name], deleteId: p.id });
    } else {
      nameMap[p.name] = p.id;
    }
  });

  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} duplicates.`);
    duplicates.forEach(d => {
      console.log(`- Duplicate: ${d.name} (Keep: ${d.keepId}, Delete: ${d.deleteId})`);
    });
    console.log('Run delete script to remove them.');
  } else {
    console.log('No duplicates found.');
  }

  process.exit(0);
}

checkDuplicates();
