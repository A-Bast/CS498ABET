const Portfolio = require('../models/CoursePortfolio');
const Course = require('../models/Course');
const PortfolioSLO = require('../models/CoursePortfolio/StudentLearningOutcome')
const Artifact = require('../models/CoursePortfolio/Artifact');

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
	//create course if it did not exist
	var course = await Course.query().insert({ department_id: parseInt(department_id), number: parseInt(course_number) });
	//create new portfolio object
	var new_portfolio = await Portfolio.query().insert({
		course_id: course.id,
		instructor_id: instructor,
		semester_term_id: parseInt(semester),
		num_students: parseInt(num_students),
		section: parseInt(section),
		year: parseInt(year)
	});
	//Create the links between the portfolio and the SLOs
	for(x = 0; x < student_learning_outcomes.length; x++){
		var link = await PortfolioSLO.query().insert({
			portfolio_id: new_portfolio.id,
			slo_id: student_learning_outcomes[x]
		})
		//Create the 3 artifacts
		for(y = 1; y <= 3; y++){
			var new_artifact = await Artifact.query().insert({
				portfolio_slo_link_id: link.id,
				index: y
			})
			//create evaluations
		}
	}
	return {
		id: new_portfolio.id
	};
};


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
