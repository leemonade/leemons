const { keys, trim, isNil, isEmpty, toLower, isNumber } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importAcademicPortfolioPrograms(filePath, centers, grades) {
  const items = await itemsImport(filePath, 'ap_programs', 40, true, true);

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const program = items[key];

      // ·····················································
      // CENTERS

      program.centers = program.centers
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => centers[val]?.id);

      // ·····················································
      // GRADES

      program.evaluationSystem = grades[program.evaluationSystem]?.id;

      // ·····················································
      // CREDITS & DURATION

      if (program.creditSystem) {
        const totalHours = Number(program.credits) * Number(program.hoursPerCredit);
        program.totalHours = totalHours;
      }

      if (!program.creditSystem) {
        program.credits = null;
        program.hoursPerCredit = null;
        if (Number(program.totalHours ?? 0) > 0) {
          program.totalHours = Number(program.totalHours);
        } else {
          delete program.totalHours;
        }
      }

      // ·····················································
      // COURSES

      program.courses = [];
      for (let i = 0; i < program.maxNumberOfCourses; i++) {
        program.courses.push({ index: i + 1, minCredits: null, maxCredits: null });
      }

      if (!isEmpty(program.courseCredits) && program.creditSystem) {
        const courseCreditsArray = program.courseCredits
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => {
            const [index, credits] = val.split(':');
            const [minCredits, maxCredits] = credits
              .split('|')
              .map((item) => (!isEmpty(item) ? Number(item) : null));
            return {
              index: Number(index),
              minCredits,
              maxCredits,
            };
          });

        courseCreditsArray.forEach((courseCredit) => {
          const courseIndex = program.courses.findIndex(
            (course) => course.index === courseCredit.index
          );
          if (courseIndex !== -1) {
            program.courses[courseIndex].minCredits = courseCredit.minCredits;
            program.courses[courseIndex].maxCredits = courseCredit.maxCredits;
          }
        });
      }
      delete program.courseCredits;

      // Seats
      if (program.referenceGroups) {
        if (!program.seatsPerCourse)
          throw new Error(
            'Courses must have specified seats for Program that use reference groups.'
          );
        // We allow both formats: a) Single number (20); b) A string representing courseIndex:numberOfSeats (1:20)
        const sameSeatsForAllCourses = isNumber(program.seatsPerCourse)
          ? true
          : !program.seatsPerCourse.includes(',');
        if (sameSeatsForAllCourses) {
          program.seatsForAllCourses = isNumber(program.seatsPerCourse)
            ? program.seatsPerCourse
            : Number(program.seatsPerCourse.split(':')[1]);
          program.courses = program.courses.map((course) => ({
            ...course,
            seats: program.seatsPerCourse,
          }));
        } else {
          program.seatsPerCourse
            .split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .forEach((val) => {
              const [courseIndex, seats] = val.split(':');
              const courseToUpdate = program.courses.find(
                (course) => course.index === Number(courseIndex)
              );
              if (courseToUpdate) {
                courseToUpdate.seats = Number(seats);
              }
            });
        }
      }
      delete program.seatsPerCourse;
      delete program.creditSystem;

      // ·····················································
      // GROUPS

      if (program.referenceGroups) {
        const finalNameFormat = program.prefix ? 'custom' : program.nameFormat;
        const finalReferenceGroups = {
          nameFormat: finalNameFormat,
          digits: program.digits ?? null,
          customNameFormat: null,
          prefix: program.prefix ?? null,
        };

        if (finalNameFormat === 'custom') {
          finalReferenceGroups.customNameFormat = program.nameFormat;
        }

        if (!program.sequentialCourses) {
          finalReferenceGroups.groupsForAllCourses = Number(program.groupsPerCourse ?? 1);
        } else {
          program.groupsPerCourse
            .split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .forEach((val) => {
              const [courseIndex, amountOfGroups] = val.split(':');
              finalReferenceGroups[`groupsForCourse${courseIndex}`] = Number(amountOfGroups);
            });
        }
        program.referenceGroups = finalReferenceGroups;
      } else {
        delete program.referenceGroups;
      }

      delete program.prefix;
      delete program.nameFormat;
      delete program.digits;
      delete program.groupsPerCourse;

      // ·····················································
      // SUBSTAGES

      if (!isEmpty(program.substages)) {
        program.substages = program.substages
          .split(',')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((val) => {
            const [name, abbreviation] = val.split('|');
            return { name, abbreviation };
          });

        program.numberOfSubstages = program.substages.length;
        program.useDefaultSubstagesName = false;
      }

      // ·····················································
      // CYCLES

      if (program.sequentialCourses) {
        if (!isEmpty(program.cycles)) {
          program.cycles = program.cycles
            .split(',')
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .map((val, i) => {
              const [name, courses] = val.split('@');
              return {
                name,
                index: i + 1,
                courses: courses
                  .split('|')
                  .filter((course) => !isEmpty(course))
                  .map(Number),
              };
            });
        }
      } else {
        // Make sure no cycles are created
        delete program.cycles;
      }

      // ·····················································
      // SUBJECTS (Only for retro-compatibility purposes)
      program.moreThanOneAcademicYear = !program.sequentialCourses;

      items[key] = program;
    });

  return items;
}

module.exports = importAcademicPortfolioPrograms;
