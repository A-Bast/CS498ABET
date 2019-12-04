const Portfolio = require('../models/CoursePortfolio');
const Course = require('../models/Course');
const PortfolioSLO = require('../models/CoursePortfolio/StudentLearningOutcome');
const Artifact = require('../models/CoursePortfolio/Artifact');
const Evaluation = require('../models/CoursePortfolio/Artifact/Evaluation');
const numStudents = require('./students');

//new function written by Anna Bast
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
			slo_id: parseInt(student_learning_outcomes[x])
		});
		//Create the 3 artifacts
		for(y = 1; y <= 3; y++){
			let new_artifact = await Artifact.query().insert({
				portfolio_slo_id: link.id,
				index: y,
			});
			//create evaluations
			let student_indexes = numStudents(num_students);
			for(z = 0; z <= student_indexes.length; z++){
				await Evaluation.query().insert({
					artifact_id: new_artifact.id,
					evaluation_index: z,
					student_index: student_indexes[z]
				})
			}
		}
	}
	return {
		id: new_portfolio.id
	};
};

//Logan Manns Date Additions
//Setup to make readonly mark for portfolios
//Also sets up needed values for displaying the date that portfolios will be made read only
//values are based on the fall 2019 semester and spring 2020 semester for the university of Kentucky
var currentDateMonth=new Date().getMonth
var currentDateDay=new Date().getDate
var current
var springDueDateDay=22
var fallDueDateDay=3
var springDueDateMonth=4
var fallDueDateMonth=0
var readOnly=false
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
		.findById(portfolio_id);
	if(currentDateMonth==springDueDateMonth)
	{
		if(currentDateDay>=springDueDateDay)
		{
			readOnly=true
		}
	}
	if(currentDateMonth==fallDueDateMonth)
	{
		if(currentDateDay>=fallDueDateDay)
		{
			readOnly=false
		}
	}
		
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
	};

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
};
//Logan Manns implementation for function to display a portfolio for a professor proffessor portfolio
//Reviewed by Anna Bast
module.exports.show = async () => 
{
	var selector=0;
	let portfolio= Portfolio.get(selector);
	while(portfolio.portfolio_id!=null)
	{
		print(portfolio);
		portfolio=Portfolio.get(selector)
	}

};
// Edited by: Anna Bast
// Viwed by: Jeremy Farmer
// Phase 3 reviewed by: Logan Manns
// Comment: This looks fine. Anna says that the functions works and I'll take her word for it. Everything looks fine and it seems that it would work. 
// Phase 3: Anna's changes look good and should create the objects that are needed for the project.
