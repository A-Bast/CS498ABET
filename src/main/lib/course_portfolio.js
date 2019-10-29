const Portfolio = require('../models/CoursePortfolio')
const Course = require('../models/Course')
const User = require('../models/User')
const Term = require('../models/Term')
const StudentLearningOutcome = require('../models/StudentLearningOutcome')

module.exports.new = async ({
	department_id,
	course_number,
	instructor,
	semester,
	year,
	num_students,
	student_learning_outcomes,
	section
}) => {
	// TODO
    console.log(await Course.query().delete().where('number', '=', parseInt(course_number)))
    console.log(await User.query().delete().where('linkblue_username', '=', 'test'))
    var course = await Course.query().insert({ department_id: parseInt(department_id), number: parseInt(course_number) });
    var user = await User.query().insert({ linkblue_username: 'test' })
    var new_portfolio = Portfolio.query().insert({
        course_id: course.id,
        instructor_id: user.id,
        semester_term_id: 1, //to be changed later
        num_students: num_students,
        section: section,
        year: year
    })
    //end addition
	return {
        id: new_portfolio.id
	};
}


module.exports.get = async (portfolio_id) => {
	let raw_portfolio = await Portfolio.query()
		.eager({
			course: {
				department: true
			},
			instructor: true,
			semester: true,
			outcomes: {
				slo: {
					metrics: true
				},
				artifacts: {
					evaluations: true
				}
			}
		})
		.findById(portfolio_id)

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],
		course: {
			department: raw_portfolio.course.department.identifier,
			number: raw_portfolio.course.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},
	}

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}
