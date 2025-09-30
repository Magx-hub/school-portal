// ========================================
// CRUD OPERATIONS
// ========================================

export class CurriculumManager {
  constructor(data) {
    this.curriculum = JSON.parse(JSON.stringify(data)); // Deep copy
  }

  // CREATE - Add new level
  addLevel(levelData) {
    this.curriculum.curriculum.levels.push(levelData);
    return this.curriculum;
  }

  // CREATE - Add new strand to a level
  addStrand(levelName, strandData) {
    const level = this.findLevel(levelName);
    if (level) {
      level.strands.push(strandData);
      return true;
    }
    return false;
  }

  // CREATE - Add new sub-strand
  addSubStrand(levelName, strandNumber, subStrandData) {
    const strand = this.findStrand(levelName, strandNumber);
    if (strand && strand.sub_strands) {
      strand.sub_strands.push(subStrandData);
      return true;
    }
    return false;
  }

  // READ - Find level by name
  findLevel(levelName) {
    return this.curriculum.curriculum.levels.find(level => 
      level.level === levelName
    );
  }

  // READ - Find strand by level and strand number
  findStrand(levelName, strandNumber) {
    const level = this.findLevel(levelName);
    return level ? level.strands.find(strand => 
      strand.strand_number === strandNumber
    ) : null;
  }

  // READ - Find sub-strand
  findSubStrand(levelName, strandNumber, subStrandNumber) {
    const strand = this.findStrand(levelName, strandNumber);
    return strand && strand.sub_strands ? 
      strand.sub_strands.find(sub => sub.sub_strand_number === subStrandNumber) : null;
  }

  // UPDATE - Update level information
  updateLevel(levelName, updates) {
    const level = this.findLevel(levelName);
    if (level) {
      Object.assign(level, updates);
      return true;
    }
    return false;
  }

  // UPDATE - Update strand information
  updateStrand(levelName, strandNumber, updates) {
    const strand = this.findStrand(levelName, strandNumber);
    if (strand) {
      Object.assign(strand, updates);
      return true;
    }
    return false;
  }

  // DELETE - Remove level
  deleteLevel(levelName) {
    const index = this.curriculum.curriculum.levels.findIndex(level => 
      level.level === levelName
    );
    if (index !== -1) {
      this.curriculum.curriculum.levels.splice(index, 1);
      return true;
    }
    return false;
  }

  // DELETE - Remove strand
  deleteStrand(levelName, strandNumber) {
    const level = this.findLevel(levelName);
    if (level) {
      const index = level.strands.findIndex(strand => 
        strand.strand_number === strandNumber
      );
      if (index !== -1) {
        level.strands.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}

// ========================================
// SEARCH FUNCTIONS
// ========================================

export class CurriculumSearch {
  constructor(data) {
    this.curriculum = data;
  }

  // Search by text (case-insensitive)
  searchByText(searchTerm) {
    const results = [];
    const term = searchTerm.toLowerCase();

    this.curriculum.curriculum.levels.forEach(level => {
      // Search in level
      if (level.level.toLowerCase().includes(term)) {
        results.push({
          type: 'level',
          level: level.level,
          match: level.level,
          content_standards: level.content_standards[0] || null
        });
      }

      level.strands.forEach(strand => {
        // Search in strand name
        if (strand.strand_name.toLowerCase().includes(term)) {
          results.push({
            type: 'strand',
            level: level.level,
            strand_number: strand.strand_number,
            match: strand.strand_name,
            content_standards: strand.content_standards[0] || null
          });
        }

        // Search in sub-strands
        if (strand.sub_strands) {
          strand.sub_strands.forEach(subStrand => {
            if (subStrand.sub_strand_name.toLowerCase().includes(term)) {
              results.push({
                type: 'sub_strand',
                level: level.level,
                strand_number: strand.strand_number,
                sub_strand_number: subStrand.sub_strand_number,
                content_standards: subStrand.content_standards[0] || null,
                match: subStrand.sub_strand_name,
              });
            }
          });
        }
      });
    });

    return results;
  }

  // Search by content standard
  searchByContentStandard(standard) {
    const results = [];

    this.curriculum.curriculum.levels.forEach(level => {
      if (level.content_standard === standard) {
        results.push({ type: 'level', data: level });
      }

      level.strands.forEach(strand => {
        if (strand.content_standard === standard) {
          results.push({
            type: 'strand',
            level: level.level,
            data: strand
          });
        }
      });
    });

    return results;
  }

  // Get all items of a specific type
  getByType(type) {
    const results = [];

    this.curriculum.curriculum.levels.forEach(level => {
      if (type === 'level') {
        results.push(level);
      }

      level.strands.forEach(strand => {
        if (type === 'strand') {
          results.push({
            ...strand,
            level: level.level
          });
        }

        if (type === 'sub_strand' && strand.sub_strands) {
          strand.sub_strands.forEach(subStrand => {
            results.push({
              ...subStrand,
              level: level.level,
              parent_strand: strand.strand_name
            });
          });
        }
      });
    });

    return results;
  }

  // Advanced search with filters
  advancedSearch(filters = {}) {
    let results = [];

    this.curriculum.curriculum.levels.forEach(level => {
      level.strands.forEach(strand => {
        if (strand.sub_strands) {
          strand.sub_strands.forEach(subStrand => {
            const item = {
              level: level.level,
              level_page: level.page,
              strand_number: strand.strand_number,
              strand_name: strand.strand_name,
              strand_content_standards: strand.content_standards[0] || null,
              sub_strand_number: subStrand.sub_strand_number,
              sub_strand_name: subStrand.sub_strand_name,
            };
            results.push(item);
          });
        }
      });
    });

    // Apply filters
    if (filters.level) {
      results = results.filter(item => item.level === filters.level);
    }
    if (filters.strand_contains) {
      const term = filters.strand_contains.toLowerCase();
      results = results.filter(item => 
        item.strand_name.toLowerCase().includes(term)
      );
    }
    if (filters.page_range) {
      const [min, max] = filters.page_range;
      results = results.filter(item => 
        item.sub_strand_page >= min && item.sub_strand_page <= max
      );
    }

    return results;
  }
}
