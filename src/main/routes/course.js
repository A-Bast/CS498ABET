var express = require('express');
var mustache = require('../common/mustache');
var html = require('../common/html');
var course_portfolio_lib = require('../lib/course_portfolio');
var router = express.Router();

const Department = require('../models/Department');
const TermType = require('../models/TermType');
const PortfolioSLO = require('../models/CoursePortfolio/StudentLearningOutcome');

const course_manage_page = async (res, portfolio_id) => {
	//course_info code written by Anna Bast
	//select * from portfolio_slo where "portfolio_id" = portfolio_id
	let portfolioSLOs = await PortfolioSLO.query().where('portfolio_id',portfolio_id);//array of portfolio_slo
	let course_info = { student_learning_outcomes: []};
	for(let i = 0; i < portfolioSLOs.length; i++){
		let new_slo = await portfolioSLOs[i].$relatedQuery('slo');// portfolio_slo has one slo
		let slo_info = {
			index: new_slo.index,
			description: new_slo.description,
			//slo has many metrics
			metrics: await new_slo.$relatedQuery('metrics').select('name', 'exceeds', 'meets', 'partially', 'not'),
			artifacts: []
		};

		//slo has many metrics
		let new_metrics = await new_slo.$relatedQuery('metrics');
		//portfolio_slo has 3 artifacts
		let new_artifacts = await portfolioSLOs[i].$relatedQuery('artifacts');
		for(let j = 0; j < new_artifacts.length; j++){
			let artifact_info  = {
				name:  new_artifacts[j].name,
				artifact_index: new_artifacts[j].index,
				evaluations: []
			};

			//artifact has many evaluations
			let new_evaluations = await new_artifacts[j].$relatedQuery('evaluations');
			for(let k = 0; k < new_evaluations.length; k++){
				let evaluation_info = {
					index: new_evaluations[k].student_index,
					evaluation: []
				};
				for(let l = 0; l < new_metrics.length; l++){
					let metric_info = {
						metric: new_evaluations[k].evaluation_index,
						value: 6
					};
					evaluation_info.evaluation.push(metric_info);
				}
				artifact_info.evaluations.push(evaluation_info);
			}
			slo_info.artifacts.push(artifact_info)
		}
		course_info.student_learning_outcomes.push(slo_info);
	}

	res.render('base_template', {
		title: 'CS498 Course Portfolio',
		body: mustache.render('course/manage', course_info)
	})
};

const course_new_page = async (res, department = false) => {
	const departments = await Department.query().select();
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms');
	let student_learning_outcomes = false;

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
};

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		res.render('base_template', {
			title: 'Course Portfolios',
			body: mustache.render('course/index')
		})
	}));

/* GET course page */
router.route('/:id')
	.get(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			await course_new_page(res)
		} else {
			await course_manage_page(res, req.params.id)
		}
	}))
	.post(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			if (req.body.course_submit) {
				const course_portfolio = await course_portfolio_lib.new({
					department_id: req.body.department,
					course_number: req.body.course_number,
					instructor: 1,
					semester: req.body.semester,
					year: req.body.course_year,
					num_students: req.body.num_students,
					student_learning_outcomes: Object.entries(req.body)
						.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
						.map(entry => entry[0].split('_')[1]),
					section: req.body.course_section
				});

				res.redirect(302, `/course/${course_portfolio.id}`)
			} else {
				await course_new_page(res, req.body.department)
			}
		} else {
			await course_manage_page(res, 499)
		}
	}));

module.exports = router;

// Edited by: Anna Bast
// Reviewed by: Jeremy Farmer
// Comment: This looks good. I confirmed that I checked over it and it looks like it should work.
