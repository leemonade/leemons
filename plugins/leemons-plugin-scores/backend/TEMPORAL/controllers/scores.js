const { getScores, removeScores, setScores } = require('../src/services/scores');

module.exports = {
  get: async (ctx) => {
    try {
      const {
        query,
        state: { userSession },
      } = ctx;

      const scoresQuery = {
        students: query.students ? JSON.parse(query.students) : undefined,
        classes: query.classes ? JSON.parse(query.classes) : undefined,
        gradedBy: query.gradedBy ? JSON.parse(query.gradedBy) : undefined,
        periods: query.periods ? JSON.parse(query.periods) : undefined,
        published: query.published ? query.published === 'true' : undefined,
      };

      const scores = await getScores(scoresQuery, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        scores,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  set: async (ctx) => {
    try {
      const {
        request: { body },
        state: { userSession },
      } = ctx;

      const scores = body.scores.map((score) => ({
        student: score.student,
        class: score.class,
        period: score.period,
        grade: score.grade,
        gradedBy: userSession.userAgents[0].id,
        published: score.published || false,
      }));

      await setScores(scores, { userSession });

      ctx.status = 201;
      ctx.body = {
        status: 201,
        message: 'Scores set',
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  remove: async (ctx) => {
    try {
      const {
        query,
        state: { userSession },
      } = ctx;

      const scoresQuery = {
        students: query.students ? JSON.parse(query.students) : undefined,
        classes: query.classes ? JSON.parse(query.classes) : undefined,
        gradedBy: query.gradedBy ? JSON.parse(query.gradedBy) : undefined,
        periods: query.periods ? JSON.parse(query.periods) : undefined,
        published: query.published ? query.published === 'true' : undefined,
      };

      await removeScores(scoresQuery, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: 'Scores removed',
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
};
