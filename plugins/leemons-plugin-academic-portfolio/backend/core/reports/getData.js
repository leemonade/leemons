async function getData({ ctx, locale }) {
  const pipeline = [
    {
      $match: {
        deploymentID: ctx.meta.deploymentID,
        isDeleted: false,
      },
    },
    {
    $lookup: {
      from: 'v1::academic-portfolio_classteachers',
      let: { classId: '$id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$class', '$$classId'] },
                { $eq: ['$type', 'main-teacher'] },
              ],
            },
          },
        },
        {
            $project: {
              teacher: 1,
              createdAt: 1
            }
          }
      ],
      as: 'mainTeacher',
    },
  },
  {
    $lookup: {
      from: 'v1::academic-portfolio_classstudents',
      let: { classId: '$id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$class', '$$classId'] },
          },
        },
        {
            $project: {
              student: 1,
              createdAt: 1
            }
          }
      ],
      as: 'students',
    },
  },
  {
    $addFields: {
      allUserAgents: {
        $concatArrays: [ '$students.student', '$mainTeacher.teacher']
      },
    }
  },
  {
      $lookup: {
        from: 'v1::users_useragents',
        localField: 'allUserAgents',
        foreignField: 'id',
        as: 'userAgent'
      }
  },
  {
      $lookup: {
        from: 'v1::users_users',
        localField: 'userAgent.user',
        foreignField: 'id',
        as: 'user'
      }
  },
  {
    $unwind: {
      path: "$students",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: "$mainTeacher",
      preserveNullAndEmptyArrays: true
    }
  },
  {
      $addFields: {
        teacherUserAgent: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$userAgent",
                as: "ua",
                cond: { $eq: ["$$ua.id", "$mainTeacher.teacher"] }
              }
            },
            0
          ]
        },
        studentUserAgent: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$userAgent",
                as: "ua",
                cond: { $eq: ["$$ua.id", "$students.student"] }
              }
            },
            0
          ]
        }
      }
    },
    {
      $addFields: {
        teacherUser: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$user",
                as: "u",
                cond: { $eq: ["$$u.id", "$teacherUserAgent.user"] }
              }
            },
            0
          ]
        },
        studentUser: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$user",
                as: "u",
                cond: { $eq: ["$$u.id", "$studentUserAgent.user"] }
              }
            },
            0
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'v1::academic-portfolio_programs',
        localField: 'program',
        foreignField: 'id',
        as: 'program'
      }
    },
    { $unwind: '$program' },
    {
      $lookup: {
        from: 'v1::academic-portfolio_subjects',
        localField: 'subject',
        foreignField: 'id',
        as: 'subject'
      }
    },
    { $unwind: '$subject' },
    {
        $lookup: {
          from: 'v1::academic-portfolio_classcourses',
          localField: 'id',
          foreignField: 'class',
          as: 'classCourse',
        },
      },
      {
        $lookup: {
          from: 'v1::academic-portfolio_groups',
          localField: 'classCourse.course',
          foreignField: 'id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $lookup: {
          from: 'v1::academic-portfolio_programcenters',
          localField: 'program.id',
          foreignField: 'program',
          as: 'centerPrograms',
        },
      },
      {
        $lookup: {
          from: 'v1::users_centers',
          localField: 'centerPrograms.center',
          foreignField: 'id',
          as: 'center',
        },
      },
      { $unwind: '$center' },
      {
        $lookup: {
          from: 'v1::xapi_statements',
          let: { teacherId: '$mainTeacher.teacher' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$type', 'log'] },
                    { $eq: ['$statement.actor.account.name', '$$teacherId'] },
                    { $regexMatch: { input: '$statement.object.id', regex: /^.*\/api\/view\/program$/ } }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'teacherLastConnection'
        }
      },
      // Add lookup for student's last connection
      {
        $lookup: {
          from: 'v1::xapi_statements',
          let: { studentId: '$students.student' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$type', 'log'] },
                    { $eq: ['$statement.actor.account.name', '$$studentId'] },
                    { $regexMatch: { input: '$statement.object.id', regex: /^.*\/api\/view\/program$/ } }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'studentLastConnection'
        }
      },
    {
      $project: {
        _id: 0,
        // teacherUserAgent: '$mainTeacher.teacher',
        teacher: {
            $concat: [
              { $ifNull: ['$teacherUser.surnames', ''] },
              {
                $cond: [
                  {
                    $and: [
                      { $ifNull: ['$teacherUser.surnames', false] },
                      { $ifNull: ['$teacherUser.name', false] },
                    ],
                  },
                  ', ',
                  '',
                ],
              },
              { $ifNull: ['$teacherUser.name', ''] },
            ],
          },
        teacherEmail: '$teacherUser.email',
        teacherEnrollmentDate: '$mainTeacher.createdAt',
        // studentUserAgent: '$students.student',
        student: {
            $concat: [
              { $ifNull: ['$studentUser.surnames', ''] },
              {
                $cond: [
                  {
                    $and: [
                      { $ifNull: ['$studentUser.surnames', false] },
                      { $ifNull: ['$studentUser.name', false] },
                    ],
                  },
                  ', ',
                  '',
                ],
              },
              { $ifNull: ['$studentUser.name', ''] },
            ],
          },
        studentEmail: '$studentUser.email',
        studentEnrollmentDate: '$students.createdAt',
        classroom: '$classWithoutGroupId',
        program: '$program.name',
        // programId: '$program.id',
        subject: '$subject.name',
        course: '$course.name',
        center: '$center.name',
        teacherLastConnection: { $arrayElemAt: ['$teacherLastConnection.createdAt', 0] },
        studentLastConnection: { $arrayElemAt: ['$studentLastConnection.createdAt', 0] },
      }
    }
  ];

  return ctx.db.Class.aggregate(pipeline);
}

module.exports = { getData };
