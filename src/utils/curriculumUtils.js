// ========================================
// UTILITY FUNCTIONS
// ========================================

// Generate flat list for easier processing
export function flattenCurriculum(data) {
  const flattened = [];
  
  data.curriculum.levels.forEach(level => {
    level.strands.forEach(strand => {
      const baseItem = {
        level: level.level,
        level_page: level.page,
        strand_number: strand.strand_number,
        strand_name: strand.strand_name,
        strand_page: strand.page
      };

      if (strand.sub_strands) {
        strand.sub_strands.forEach(subStrand => {
          flattened.push({
            ...baseItem,
            sub_strand_number: subStrand.sub_strand_number,
            sub_strand_name: subStrand.sub_strand_name,
            sub_strand_page: subStrand.page,
            type: 'sub_strand'
          });
        });
      } else {
        flattened.push({
          ...baseItem,
          type: 'strand_only'
        });
      }
    });
  });

  return flattened;
}

// Create index for fast lookups
export function createSearchIndex(data) {
  const index = {
    byLevel: {},
    byStrand: {},
    byPage: {},
    byKeyword: {}
  };

  const flattened = flattenCurriculum(data);
  
  flattened.forEach(item => {
    // Index by level
    if (!index.byLevel[item.level]) {
      index.byLevel[item.level] = [];
    }
    index.byLevel[item.level].push(item);

    // Index by strand name
    const strandKey = item.strand_name.toLowerCase();
    if (!index.byStrand[strandKey]) {
      index.byStrand[strandKey] = [];
    }
    index.byStrand[strandKey].push(item);

    // Index by page
    [item.level_page, item.strand_page, item.sub_strand_page].forEach(page => {
      if (page) {
        if (!index.byPage[page]) {
          index.byPage[page] = [];
        }
        index.byPage[page].push(item);
      }
    });

    // Index by keywords
    const keywords = [
      item.level, item.strand_name, item.sub_strand_name || ''
    ].join(' ').toLowerCase().split(/\s+/);
    
    keywords.forEach(keyword => {
      if (keyword.length > 2) { // Skip very short words
        if (!index.byKeyword[keyword]) {
          index.byKeyword[keyword] = [];
        }
        index.byKeyword[keyword].push(item);
      }
    });
  });

  return index;
}
