import { supabaseAdmin } from '../db/supabaseClient.js';

async function deduplicatePatterns() {
  console.log('Fetching patterns...');
  const { data: patterns, error } = await supabaseAdmin
    .from('patterns')
    .select('name, id')
    .order('name');

  if (error) {
    console.error('Error fetching patterns:', error);
    process.exit(1);
  }

  const nameMap = {};
  const duplicates = [];

  patterns.forEach(p => {
    if (nameMap[p.name]) {
      // Found a duplicate. The first one is kept (nameMap[p.name]).
      // This one (p.id) is the duplicate to be merged/deleted.
      duplicates.push({ name: p.name, keepId: nameMap[p.name], deleteId: p.id });
    } else {
      nameMap[p.name] = p.id;
    }
  });

  if (duplicates.length === 0) {
    console.log('No duplicates found.');
    process.exit(0);
  }

  console.log(`Found ${duplicates.length} duplicates. Starting deduplication...`);

  for (const dup of duplicates) {
    console.log(`Processing ${dup.name}: Merging ${dup.deleteId} into ${dup.keepId}...`);

    // 1. Update problems to point to the keepId
    const { error: updateError } = await supabaseAdmin
      .from('problems')
      .update({ pattern_id: dup.keepId })
      .eq('pattern_id', dup.deleteId);

    if (updateError) {
      console.error(`Error updating problems for ${dup.name}:`, updateError);
      continue;
    }

    // 2. Delete the duplicate pattern
    const { error: deleteError } = await supabaseAdmin
      .from('patterns')
      .delete()
      .eq('id', dup.deleteId);

    if (deleteError) {
      console.error(`Error deleting pattern ${dup.deleteId}:`, deleteError);
    } else {
      console.log(`Successfully deduplicated ${dup.name}`);
    }
  }

  console.log('Deduplication complete.');
  process.exit(0);
}

deduplicatePatterns();
